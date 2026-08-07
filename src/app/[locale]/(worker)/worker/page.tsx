import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";
import { CheckSquare, FolderKanban, Clock, CheckCircle2, Wallet, ChevronRight } from "lucide-react";
import Link from "next/link";

import { StatCard } from "@/components/admin/overview/stat-card";
import { AdminCalendar } from "@/components/admin/overview/admin-calendar";
import { WorkerTaskDonut } from "@/components/worker/overview/worker-task-donut";
import { WorkerActiveProjects } from "@/components/worker/overview/worker-active-projects";
import { WorkerNewRequests } from "@/components/worker/overview/worker-new-requests";
import { WorkerIncomeCard } from "@/components/worker/overview/worker-income-card";
import { WorkerReminders } from "@/components/worker/overview/worker-reminders";

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
    // Tasks assigned to this worker or in worker projects
    prisma.task
      .findMany({
        where: {
          OR: [
            { assigneeId: dbUser.id },
            { project: { workerId: dbUser.id } },
          ],
        },
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
    
    let progress = 0;
    if (totalTasks > 0) {
      const taskPct = Math.round((doneTasksCount / totalTasks) * 100);
      progress = p.status === "IN_PROGRESS" ? Math.max(50, Math.min(95, taskPct)) : taskPct;
    } else {
      switch (p.status) {
        case "REQUESTED": progress = 10; break;
        case "WORKER_REVIEW": progress = 25; break;
        case "PENDING_DP": progress = 40; break;
        case "IN_PROGRESS": progress = 65; break;
        case "ON_HOLD": progress = 65; break;
        case "COMPLETED": progress = 100; break;
        case "IN_WARRANTY": progress = 100; break;
        default: progress = 0; break;
      }
    }

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
    offeredPrice: r.offeredPrice ? Number(r.offeredPrice) : null,
    offeredDuration: r.offeredDuration || null,
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 md:p-6 shadow-xs flex flex-row items-center justify-between gap-4">
        {/* Left Side: Wallet Icon + Total Income Title + Amount */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/25 border-none">
            <Wallet className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 tracking-tight uppercase">
              {t("totalIncome")}
            </span>
            <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight truncate mt-0.5">
              {new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(totalIncome)}
            </h3>
          </div>
        </div>

        {/* Right Side: Net Income Badge + Details Button (Stacked Atas-Bawah) */}
        <div className="flex flex-col items-end justify-center gap-2 shrink-0">
          <span className="text-[10px] sm:text-xs font-bold text-white bg-emerald-600 px-3 py-0.5 sm:py-1 rounded-full shadow-xs border-none inline-block">
            {t("netIncome")}
          </span>

          <Link
            href={`/${locale}/worker/finance`}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
          >
            {t("detail")} <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

        <div className="lg:col-span-3">
          <AdminCalendar projects={activeProjects as any} />
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
