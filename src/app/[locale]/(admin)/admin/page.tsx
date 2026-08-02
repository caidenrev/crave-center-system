import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import {
  FolderKanban,
  Users,
  ShieldAlert,
  CheckSquare,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react";
import Link from "next/link";
import { AdminActivityChart } from "@/components/admin/admin-activity-chart";
import { AdminWorkerDonutChart } from "@/components/admin/admin-worker-donut-chart";

export default async function AdminDashboardPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  await requireRole(["ADMIN"]);
  const t = await getTranslations("AdminDashboard");

  // 1. Fetch main stats from DB (with fallbacks)
  const totalUsers = await prisma.user.count().catch(() => 0);
  const totalProjects = await prisma.project.count().catch(() => 0);
  const pendingApps = await prisma.workerApplication
    .count({
      where: { status: "PENDING" },
    })
    .catch(() => 0);
  const activeRequests = await prisma.project
    .count({
      where: { status: "REQUESTED" },
    })
    .catch(() => 0);

  // 2. Fetch worker workload stats
  const totalWorkers = await prisma.user
    .count({
      where: { role: "TEAM_MEMBER" },
    })
    .catch(() => 0);

  const activeAssignedProjects = await prisma.project
    .findMany({
      where: {
        status: {
          in: [
            "WORKER_REVIEW",
            "PENDING_DP",
            "IN_PROGRESS",
            "ON_HOLD",
            "IN_WARRANTY",
          ],
        },
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
  const awayWorkers = 0;

  // 3. Fetch recent projects for activity feed
  const recentProjects = await prisma.project
    .findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { client: true, worker: true },
    })
    .catch(() => []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Admin Overview & Analytics
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t("title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/admin/requests`}
            className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" /> {t("viewRequests")} ({activeRequests})
          </Link>
        </div>
      </div>

      {/* Stats Cards - Responsive 2-column grid on mobile/tablet, 4-column on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Card 1: Total Users */}
        <div className="bg-linear-to-br from-indigo-600 via-indigo-700 to-blue-800 text-white rounded-3xl p-5 md:p-6 shadow-xl shadow-indigo-900/20 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-3 md:mb-4 relative z-10">
            <span className="font-medium text-white/90 text-xs md:text-sm">
              {t("totalUsers")}
            </span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1.5 md:mb-2 tracking-tight">
              {totalUsers}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-medium text-white/90 bg-white/15 backdrop-blur-md inline-flex px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg">
              <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5" /> {t("registered")}
            </div>
          </div>
        </div>

        {/* Card 2: Active Projects */}
        <div className="bg-linear-to-br from-purple-600 via-purple-700 to-pink-700 text-white rounded-3xl p-5 md:p-6 shadow-xl shadow-purple-900/20 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-3 md:mb-4 relative z-10">
            <span className="font-medium text-white/90 text-xs md:text-sm">
              {t("totalProjects")}
            </span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <FolderKanban className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1.5 md:mb-2 tracking-tight">
              {totalProjects}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-medium text-white/90 bg-white/15 backdrop-blur-md inline-flex px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg">
              <ArrowUpRight className="w-3 h-3 md:w-3.5 md:h-3.5" /> {t("activeArchived")}
            </div>
          </div>
        </div>

        {/* Card 3: Job Requests */}
        <div className="bg-linear-to-br from-emerald-500 via-teal-600 to-emerald-800 text-white rounded-3xl p-5 md:p-6 shadow-xl shadow-teal-900/20 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-3 md:mb-4 relative z-10">
            <span className="font-medium text-white/90 text-xs md:text-sm">
              {t("newRequests")}
            </span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <CheckSquare className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1.5 md:mb-2 tracking-tight">
              {activeRequests}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] md:text-xs font-medium text-white/90 bg-white/15 backdrop-blur-md inline-flex px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg">
              <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" /> {t("pendingReview")}
            </div>
          </div>
        </div>

        {/* Card 4: Worker Applications */}
        <div className="bg-linear-to-br from-amber-500 via-orange-600 to-red-600 text-white rounded-3xl p-5 md:p-6 shadow-xl shadow-orange-900/20 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-3 md:mb-4 relative z-10">
            <span className="font-medium text-white/90 text-xs md:text-sm">
              {t("pendingApplicants")}
            </span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <ShieldAlert className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-1.5 md:mb-2 tracking-tight">
              {pendingApps}
            </h3>
            <Link
              href={`/${locale}/admin/applications`}
              className="flex items-center gap-1 text-[11px] md:text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md inline-flex px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg transition-colors cursor-pointer"
            >
              Review Now <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Grid Row: Interactive Activity Bar Chart & Worker Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Interactive Weekly/Monthly Activity Chart */}
        <div className="lg:col-span-2 h-full flex flex-col">
          <AdminActivityChart />
        </div>

        {/* Worker Status Donut Chart */}
        <div className="lg:col-span-1 h-full flex flex-col">
          <AdminWorkerDonutChart
            locale={locale}
            totalWorkers={totalWorkers}
            availableWorkers={availableWorkers}
            busyWorkers={busyWorkers}
            awayWorkers={awayWorkers}
          />
        </div>
      </div>

      {/* Dynamic System Alerts Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
              {t("systemAlertsTitle")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t("systemAlertsSubtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full font-semibold border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {t("statusHealthy")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Dynamic Alert 1: Pending Worker Applications */}
          {pendingApps > 0 ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t("pendingAppsTitle", { count: pendingApps })}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {t("pendingAppsDesc")}
                  </p>
                </div>
              </div>
              <Link
                href={`/${locale}/admin/applications`}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex justify-center items-center gap-1 transition-colors cursor-pointer"
              >
                {t("reviewAppsBtn", { count: pendingApps })} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {t("workerAppsClearTitle")}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t("workerAppsClearDesc")}
                </p>
              </div>
            </div>
          )}

          {/* Dynamic Alert 2: Job Requests */}
          {activeRequests > 0 ? (
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t("newRequestsTitle", { count: activeRequests })}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {t("newRequestsDesc")}
                  </p>
                </div>
              </div>
              <Link
                href={`/${locale}/admin/requests`}
                className="w-full py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs flex justify-center items-center gap-1 transition-colors cursor-pointer"
              >
                {t("reviewRequestsBtn", { count: activeRequests })} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {t("requestsProcessedTitle")}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {t("requestsProcessedDesc")}
                </p>
              </div>
            </div>
          )}

          {/* Dynamic Alert 3: Database & Core System Health */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {t("databaseActiveTitle")}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {t("databaseActiveDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* System Alert Testing Note */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>
            {t("testAlertsInfo")}
          </span>
        </div>
      </div>
    </div>
  );
}
