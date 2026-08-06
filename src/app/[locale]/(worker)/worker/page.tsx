import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";
import { CheckSquare, FolderKanban, Clock, CheckCircle2, DollarSign, ChevronRight } from "lucide-react";
import Link from "next/link";

import { StatCard } from "@/components/admin/overview/stat-card";
import { RealtimeClock } from "@/components/admin/overview/realtime-clock";
import { WorkerTaskDonut } from "@/components/worker/overview/worker-task-donut";
import { WorkerActiveProjects } from "@/components/worker/overview/worker-active-projects";
import { WorkerNewRequests } from "@/components/worker/overview/worker-new-requests";
import { WorkerIncomeCard } from "@/components/worker/overview/worker-income-card";

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

  // 4. Stats card config — 4 cards matching Admin Dashboard layout
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

      {/* 4 Stats Cards — 4-column grid matching Admin Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Horizontal Total Income Card Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Icon + Text + Badge */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-xs">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-300 tracking-tight truncate">
              {t("totalIncome")}
            </span>
            <div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 inline-block">
                {t("netIncome")}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Income Amount + Action Button */}
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
            {new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(totalIncome)}
          </h3>
          <Link
            href={`/${locale}/worker/finance`}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            {t("detail")} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Dashboard Grid — balanced 12-column rows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Task Donut (6 cols) */}
        <div className="lg:col-span-6">
          <WorkerTaskDonut
            locale={locale}
            totalTasks={allTasks.length}
            todoTasks={todoTasks}
            inProgressTasks={inProgressTasks}
            reviewTasks={reviewTasks}
            doneTasks={doneTasks}
          />
        </div>

        {/* Worker Income Card (3 cols) */}
        <div className="lg:col-span-3">
          <WorkerIncomeCard incomes={recentIncomes} locale={locale} />
        </div>

        {/* Realtime Clock (3 cols) */}
        <div className="lg:col-span-3">
          <RealtimeClock />
        </div>

        {/* Active Projects (12 cols) */}
        <div className="lg:col-span-12">
          <WorkerActiveProjects
            projects={serializedProjects}
            locale={locale}
          />
        </div>

        {/* New Job Requests (12 cols) */}
        <div className="lg:col-span-12">
          <WorkerNewRequests requests={serializedRequests} />
        </div>
      </div>
    </div>
  );
}
