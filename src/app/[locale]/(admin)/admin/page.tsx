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
  Plus,
  Hexagon,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { AdminActivityChart } from "@/components/admin/admin-activity-chart";
import { AdminWorkerDonutChart } from "@/components/admin/admin-worker-donut-chart";
import { RealtimeClock } from "@/components/admin/realtime-clock";

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
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { client: true, worker: true },
    })
    .catch(() => []);

  // 4. Fetch team members for collaboration widget
  const teamMembersList = await prisma.user
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
    .catch(() => []);

  // 5. Fetch recent payments
  const recentPayments = await prisma.payment
    .findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { project: { include: { client: true } } },
    })
    .catch(() => []);

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
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/admin/requests`}
            className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" /> {t("viewRequests")} ({activeRequests})
          </Link>
        </div>
      </div>

      {/* Stats Cards - Clean Solid Colors (Donezo Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Card 1: Total Users (Primary Color) */}
        <div className="bg-primary text-white rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <span className="font-medium text-white/90 text-sm md:text-base">
              {t("totalUsers")}
            </span>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <ArrowUpRight className="w-4 h-4 text-primary stroke-[2.5]" />
            </div>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight">
              {totalUsers}
            </h3>
            <div className="flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/10 inline-flex px-2 py-1 rounded-md">
              <Users className="w-3.5 h-3.5" /> {t("registered")}
            </div>
          </div>
        </div>

        {/* Card 2: Active Projects */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <span className="font-medium text-slate-700 dark:text-slate-300 text-sm md:text-base">
              {t("totalProjects")}
            </span>
            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-semibold text-slate-900 dark:text-white mb-4 tracking-tight">
              {totalProjects}
            </h3>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 inline-flex px-2 py-1 rounded-md">
              <FolderKanban className="w-3.5 h-3.5" /> {t("activeArchived")}
            </div>
          </div>
        </div>

        {/* Card 3: Job Requests */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <span className="font-medium text-slate-700 dark:text-slate-300 text-sm md:text-base">
              {t("newRequests")}
            </span>
            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-semibold text-slate-900 dark:text-white mb-4 tracking-tight">
              {activeRequests}
            </h3>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 inline-flex px-2 py-1 rounded-md">
              <CheckSquare className="w-3.5 h-3.5" /> {t("pendingReview")}
            </div>
          </div>
        </div>

        {/* Card 4: Worker Applications */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <span className="font-medium text-slate-700 dark:text-slate-300 text-sm md:text-base">
              {t("pendingApplicants")}
            </span>
            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-semibold text-slate-900 dark:text-white mb-4 tracking-tight">
              {pendingApps}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 inline-flex px-2 py-1 rounded-md">
                <ShieldAlert className="w-3.5 h-3.5" /> Pelamar
              </div>
              {pendingApps > 0 && (
                <Link
                  href={`/${locale}/admin/applications`}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                  Review <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2 & 3: Main Dashboard Grid (Matches Reference Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
        
        {/* ROW 2 */}
        {/* Project Analytics -> AdminActivityChart */}
        <div className="lg:col-span-6">
          <AdminActivityChart />
        </div>

        {/* Reminders -> Payment History */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Payment History
              </h3>
            </div>
            
            <div className="space-y-3 flex-1">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {payment.project.client.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium truncate">
                        {payment.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Rp{Number(payment.amount).toLocaleString('id-ID')}
                    </p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 inline-block ${
                      payment.status === 'SUCCESS' ? 'text-emerald-600 bg-emerald-500/10' :
                      payment.status === 'PENDING' ? 'text-amber-600 bg-amber-500/10' :
                      'text-rose-600 bg-rose-500/10'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
              
              {recentPayments.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-50 py-4">
                  <Wallet className="w-8 h-8 mb-2" />
                  <p className="text-xs font-medium">No recent payments.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project -> Recent Projects */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Project
              </h3>
              <Link
                href={`/${locale}/admin/projects`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-primary/20 dark:border-primary/30 text-xs font-semibold text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[2.5]" /> New
              </Link>
            </div>
            
            <div className="space-y-4 flex-1">
              {recentProjects.map((project, idx) => {
                const iconColors = [
                  "text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50",
                  "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50",
                  "text-purple-500 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/50",
                  "text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50",
                ];
                const colorClass = iconColors[idx % iconColors.length];
                const dueDateStr = project.targetDeliveryDate 
                  ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(project.targetDeliveryDate))
                  : 'Not Set';

                return (
                  <div key={project.id} className="flex items-center gap-3 group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${colorClass}`}>
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {project.title}
                      </h4>
                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        Due date: {dueDateStr}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {recentProjects.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No recent projects.</p>
              )}
            </div>
          </div>
        </div>

        {/* ROW 3 */}
        {/* Team Collaboration */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Team Collaboration
              </h3>
              <Link
                href={`/${locale}/admin/team`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20 dark:border-primary/30 text-xs font-semibold text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[2.5]" /> Add Member
              </Link>
            </div>
            
            <div className="space-y-4 flex-1">
              {teamMembersList.map((member) => {
                const activeProject = member.workerProjects?.[0];
                const isWorking = !!activeProject;
                
                return (
                  <div key={member.id} className="flex items-center justify-between gap-4 p-2 -mx-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0 text-slate-400 dark:text-slate-500">
                        <Hexagon className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{member.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          Working on <span className="font-semibold text-slate-700 dark:text-slate-300">{isWorking ? activeProject.title : "Internal Tasks"}</span>
                        </p>
                      </div>
                    </div>
                    
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border shrink-0 ${
                      isWorking 
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' 
                        : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    }`}>
                      {isWorking ? 'In Progress' : 'Completed'}
                    </span>
                  </div>
                );
              })}
              
              {teamMembersList.length === 0 && (
                <p className="text-sm text-slate-500 py-4">No team members yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Project Progress -> AdminWorkerDonutChart */}
        <div className="lg:col-span-4">
          <AdminWorkerDonutChart
            locale={locale}
            totalWorkers={totalWorkers}
            availableWorkers={availableWorkers}
            busyWorkers={busyWorkers}
            awayWorkers={awayWorkers}
          />
        </div>

        {/* Time Tracker Realtime Clock */}
        <div className="lg:col-span-3">
          <RealtimeClock />
        </div>
      </div>

      {/* ROW 4: System Alerts Section (Kept at the very bottom as requested) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-primary" />
              {t("systemAlertsTitle")}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t("systemAlertsSubtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium border border-primary/20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t("statusHealthy")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Dynamic Alert 1: Pending Worker Applications */}
          {pendingApps > 0 ? (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t("pendingAppsTitle", { count: pendingApps })}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t("pendingAppsDesc")}
                  </p>
                </div>
              </div>
              <Link
                href={`/${locale}/admin/applications`}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-xs flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
              >
                {t("reviewAppsBtn", { count: pendingApps })} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-800 text-slate-500 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {t("workerAppsClearTitle")}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {t("workerAppsClearDesc")}
                </p>
              </div>
            </div>
          )}

          {/* Dynamic Alert 2: Job Requests */}
          {activeRequests > 0 ? (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t("newRequestsTitle", { count: activeRequests })}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t("newRequestsDesc")}
                  </p>
                </div>
              </div>
              <Link
                href={`/${locale}/admin/requests`}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium text-xs flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
              >
                {t("reviewRequestsBtn", { count: activeRequests })} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-800 text-slate-500 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {t("requestsProcessedTitle")}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {t("requestsProcessedDesc")}
                </p>
              </div>
            </div>
          )}

          {/* Dynamic Alert 3: Database & Core System Health */}
          <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-800 text-slate-500 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {t("databaseActiveTitle")}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {t("databaseActiveDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* System Alert Testing Note */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="leading-relaxed">
            {t("testAlertsInfo")}
          </span>
        </div>
      </div>
    </div>
  );
}
