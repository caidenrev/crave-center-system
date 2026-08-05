import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";
import { CheckSquare, FolderKanban, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { StatCard } from "@/components/admin/overview/stat-card";
import { RealtimeClock } from "@/components/admin/overview/realtime-clock";
import { WorkerTaskDonut } from "@/components/worker/overview/worker-task-donut";
import { WorkerActiveProjects } from "@/components/worker/overview/worker-active-projects";
import { WorkerNewRequests } from "@/components/worker/overview/worker-new-requests";
import { WorkerIncomeCard } from "@/components/worker/overview/worker-income-card";
import { DollarSign } from "lucide-react";

export default async function WorkerDashboardPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  await requireRole(["TEAM_MEMBER"]);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser) return null;

  const t = await getTranslations("WorkerDashboard");

  // 1. Fetch all data in parallel
  const [
    allTasks,
    activeProjects,
    pendingRequests,
    allCompletedProjects,
  ] = await Promise.all([
    // Tasks assigned to this worker
    prisma.task
      .findMany({
        where: { assigneeId: dbUser.id },
        select: { id: true, status: true },
      })
      .catch(() => []),
    // Projects assigned to this worker (active)
    prisma.project
      .findMany({
        where: {
          workerId: dbUser.id,
          status: { in: ["IN_PROGRESS", "ON_HOLD", "IN_WARRANTY", "WORKER_REVIEW", "PENDING_DP"] },
        },
        include: { client: true, tasks: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
      })
      .catch(() => []),
    // Requests assigned to this worker by Admin waiting for worker offer
    prisma.project
      .findMany({
        where: {
          workerId: dbUser.id,
          status: "WORKER_REVIEW",
        },
        include: { client: true },
        orderBy: { targetDeliveryDate: "asc" },
      })
      .catch(() => []),
    // All completed projects to calculate income (Assuming 70% share)
    prisma.project
      .findMany({
        where: {
          workerId: dbUser.id,
          status: { in: ["COMPLETED", "IN_WARRANTY"] }
        },
        orderBy: { updatedAt: "desc" }
      })
      .catch(() => [])
  ]);

  // 2. Task stats
  const todoTasks = allTasks.filter((t) => t.status === "TO_DO").length;
  const inProgressTasks = allTasks.filter((t) => t.status === "IN_PROGRESS").length;
  const reviewTasks = allTasks.filter((t) => t.status === "REVIEW").length;
  const doneTasks = allTasks.filter((t) => t.status === "DONE").length;
  const activeTasks = todoTasks + inProgressTasks + reviewTasks;

  // 3. Serialize for client components
  const serializedProjects = activeProjects.map((p: any) => {
    const totalTasks = p.tasks?.length || 0;
    const doneTasksCount = p.tasks?.filter((t: any) => t.status === "DONE").length || 0;
    const progress = totalTasks > 0 ? Math.round((doneTasksCount / totalTasks) * 100) : 0;

    return {
      id: p.id.split("-")[0].toUpperCase(),
      title: p.title,
      client: p.client?.name || "Client",
      status: p.status,
      progress,
      dueDate: p.targetDeliveryDate
        ? new Date(p.targetDeliveryDate).toLocaleDateString()
        : null,
    };
  });

  const serializedRequests = pendingRequests.map((r: any) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    briefFileUrl: r.briefFileUrl,
    targetDeliveryDate: r.targetDeliveryDate
      ? r.targetDeliveryDate.toISOString()
      : null,
    client: {
      name: r.client.name,
      email: r.client.email,
    },
  }));

  const totalIncome = allCompletedProjects.reduce((acc: number, p: any) => {
    // 70% share for worker
    const workerShare = Number(p.offeredPrice || 0) * 0.7;
    return acc + workerShare;
  }, 0);

  const recentIncomes = allCompletedProjects.slice(0, 4).map((p: any) => ({
    id: p.id,
    amount: Number(p.offeredPrice || 0) * 0.7,
    type: "Project Revenue (70%)",
    status: "SUCCESS",
    project: { title: p.title }
  }));

  // 4. Stats card config
  const statsCards = [
    {
      title: t("activeTasks"),
      value: activeTasks,
      badgeIcon: CheckSquare,
      badgeText: t("inProgress"),
      variant: "primary" as const,
    },
    {
      title: t("completedTasks"),
      value: doneTasks,
      badgeIcon: CheckCircle2,
      badgeText: t("done"),
    },
    {
      title: t("pendingRequests"),
      value: pendingRequests.length,
      badgeIcon: Clock,
      badgeText: t("awaitingReview"),
    },
    {
      title: t("activeProjects"),
      value: activeProjects.length,
      badgeIcon: FolderKanban,
      badgeText: t("assigned"),
    },
    {
      title: "Total Pemasukan",
      value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalIncome),
      badgeIcon: DollarSign,
      badgeText: "Net Income",
      action: { href: `/${locale}/worker/finance`, label: "Detail" },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t("title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t("subtitle")}
          </p>
        </div>
        <Link
          href={`/${locale}/worker/tasks`}
          className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer w-fit"
        >
          <CheckSquare className="w-4 h-4" /> {t("viewAllTasks")} ({activeTasks})
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Task Donut */}
        <div className="lg:col-span-5">
          <WorkerTaskDonut
            locale={locale}
            totalTasks={allTasks.length}
            todoTasks={todoTasks}
            inProgressTasks={inProgressTasks}
            reviewTasks={reviewTasks}
            doneTasks={doneTasks}
          />
        </div>

        {/* Worker Income Card */}
        <div className="lg:col-span-3">
          <WorkerIncomeCard incomes={recentIncomes} locale={locale} />
        </div>

        {/* Active Projects */}
        <div className="lg:col-span-4">
          <WorkerActiveProjects
            projects={serializedProjects}
            locale={locale}
          />
        </div>

        {/* Realtime Clock */}
        <div className="lg:col-span-3">
          <RealtimeClock />
        </div>

        {/* New Job Requests — full width */}
        <div className="lg:col-span-12">
          <WorkerNewRequests requests={serializedRequests} />
        </div>
      </div>
    </div>
  );
}
