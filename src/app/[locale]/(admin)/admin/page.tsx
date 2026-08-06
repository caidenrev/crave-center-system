import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { FolderKanban, Users, DollarSign, CheckSquare } from "lucide-react";
import Link from "next/link";
import { AdminActivityChart } from "@/components/admin/overview/activity-chart";
import { AdminWorkerDonutChart } from "@/components/admin/overview/worker-donut-chart";
import { RealtimeClock } from "@/components/admin/overview/realtime-clock";
import { StatCard } from "@/components/admin/overview/stat-card";
import { PaymentHistoryCard } from "@/components/admin/overview/payment-history-card";
import { RecentProjectsCard } from "@/components/admin/overview/recent-projects-card";
import { TeamCollaborationCard } from "@/components/admin/overview/team-collaboration-card";
import { SystemAlertsSection } from "@/components/admin/overview/system-alerts-section";

export default async function AdminDashboardPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  await requireRole(["ADMIN"]);
  const t = await getTranslations("AdminDashboard");

  // 1. Fetch main stats in parallel
  const [totalUsers, totalProjects, totalRevenueAgg, pendingApps, activeRequests, delayedProjects] =
    await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.project.count().catch(() => 0),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCESS" } }).catch(() => ({ _sum: { amount: 0 } })),
      prisma.workerApplication.count({ where: { status: "PENDING" } }).catch(() => 0),
      prisma.project.count({ where: { status: "REQUESTED" } }).catch(() => 0),
      prisma.project.count({ where: { status: "ON_HOLD" } }).catch(() => 0),
    ]);
    
  const totalRevenue = Number(totalRevenueAgg._sum.amount || 0);

  // 2. Worker workload stats
  const totalWorkers = await prisma.user
    .count({ where: { role: "TEAM_MEMBER" } })
    .catch(() => 0);

  const activeAssignedProjects = await prisma.project
    .findMany({
      where: {
        status: { in: ["WORKER_REVIEW", "PENDING_DP", "IN_PROGRESS", "ON_HOLD", "IN_WARRANTY"] },
        workerId: { not: null },
      },
      select: { workerId: true },
    })
    .catch(() => []);

  const assignedWorkerIds = new Set(
    activeAssignedProjects.map((p) => p.workerId).filter(Boolean)
  );
  const busyWorkers = Math.min(assignedWorkerIds.size, totalWorkers);
  const availableWorkers = Math.max(0, totalWorkers - busyWorkers);

  // 3. Fetch widget data in parallel
  const [recentProjects, teamMembersList, recentPayments] = await Promise.all([
    prisma.project
      .findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { client: true, worker: true },
      })
      .catch(() => []),
    prisma.user
      .findMany({
        where: { role: "TEAM_MEMBER" },
        take: 4,
        orderBy: { createdAt: "desc" },
        include: {
          workerProjects: {
            where: {
              status: { in: ["IN_PROGRESS", "WORKER_REVIEW", "PENDING_DP", "ON_HOLD", "IN_WARRANTY"] },
            },
            take: 1,
          },
        },
      })
      .catch(() => []),
    prisma.payment
      .findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        include: { project: { include: { client: true } } },
      })
      .catch(() => []),
  ]);

  // 4. Activity chart aggregation
  const now = new Date();
  const startOfWeek = new Date(now);
  const dayOfWeek = now.getDay() || 7;
  startOfWeek.setDate(now.getDate() - dayOfWeek + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = now.getMonth();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const mIdx = (currentMonthIdx - (5 - i) + 12) % 12;
    return { idx: mIdx, label: months[mIdx] };
  });
  const startOf6Months = new Date(now.getFullYear(), currentMonthIdx - 5, 1);

  const [weeklyProjects, weeklyTasks, monthlyProjects, monthlyTasks] = await Promise.all([
    prisma.project.findMany({ where: { createdAt: { gte: startOfWeek } }, select: { createdAt: true } }).catch(() => []),
    prisma.task.findMany({ where: { status: "DONE", updatedAt: { gte: startOfWeek } }, select: { updatedAt: true } }).catch(() => []),
    prisma.project.findMany({ where: { createdAt: { gte: startOf6Months } }, select: { createdAt: true } }).catch(() => []),
    prisma.task.findMany({ where: { status: "DONE", updatedAt: { gte: startOf6Months } }, select: { updatedAt: true } }).catch(() => []),
  ]);

  const weeklyData = daysOfWeek.map((dayLabel, idx) => {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + idx);
    const dayStr = dayDate.toISOString().split("T")[0];
    return {
      label: dayLabel,
      req: weeklyProjects.filter((p) => p.createdAt.toISOString().split("T")[0] === dayStr).length,
      comp: weeklyTasks.filter((t) => t.updatedAt.toISOString().split("T")[0] === dayStr).length,
    };
  });

  const monthlyData = last6Months.map((m) => ({
    label: m.label,
    req: monthlyProjects.filter((p) => p.createdAt.getMonth() === m.idx).length,
    comp: monthlyTasks.filter((t) => t.updatedAt.getMonth() === m.idx).length,
  }));

  // 5. Stats card config — replaces 4x copy-pasted card JSX blocks
  const statsCards = [
    { title: t("totalUsers"), value: totalUsers, badgeIcon: Users, badgeText: t("registered"), variant: "primary" as const },
    { title: t("totalProjects"), value: totalProjects, badgeIcon: FolderKanban, badgeText: t("activeArchived") },
    { title: t("newRequests"), value: activeRequests, badgeIcon: CheckSquare, badgeText: t("pendingReview") },
    {
      title: "Total Pendapatan", // Uang yang dihasilkan
      value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalRevenue),
      badgeIcon: DollarSign,
      badgeText: "Realized Income",
      action: { href: `/${locale}/admin/finance`, label: "Detail" },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t("subtitle")}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/requests`}
          className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer w-fit"
        >
          <CheckSquare className="w-4 h-4" /> {t("viewRequests")} ({activeRequests})
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
        <div className="lg:col-span-6">
          <AdminActivityChart weeklyData={weeklyData} monthlyData={monthlyData} />
        </div>
        <div className="lg:col-span-3">
          <PaymentHistoryCard payments={recentPayments} locale={locale} />
        </div>
        <div className="lg:col-span-3">
          <RecentProjectsCard projects={recentProjects} locale={locale} />
        </div>
        <div className="lg:col-span-5">
          <TeamCollaborationCard members={teamMembersList} locale={locale} />
        </div>
        <div className="lg:col-span-4">
          <AdminWorkerDonutChart
            locale={locale}
            totalWorkers={totalWorkers}
            availableWorkers={availableWorkers}
            busyWorkers={busyWorkers}
            awayWorkers={0}
          />
        </div>
        <div className="lg:col-span-3">
          <RealtimeClock />
        </div>
      </div>

      {/* System Alerts */}
      <SystemAlertsSection
        pendingApps={pendingApps}
        activeRequests={activeRequests}
        delayedProjects={delayedProjects}
        locale={locale}
      />
    </div>
  );
}
