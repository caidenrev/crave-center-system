import { getTranslations } from "next-intl/server";
import { FolderKanban, Plus } from "lucide-react";
import Link from "next/link";

interface ProjectItem {
  id: string;
  title: string;
  status: string;
  targetDeliveryDate: Date | null;
}

const statusColors: Record<string, string> = {
  REQUESTED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  WORKER_REVIEW: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  PENDING_DP: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  IN_PROGRESS: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  ON_HOLD: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  IN_WARRANTY: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  COMPLETED: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

export async function RecentProjectsCard({
  projects,
  locale,
}: {
  projects: ProjectItem[];
  locale: string;
}) {
  const t = await getTranslations("AdminDashboard");

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {t("recentProjects")}
        </h3>
        <Link
          href={`/${locale}/admin/projects`}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-primary/20 dark:border-primary/30 text-xs font-semibold text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[2.5]" />{" "}
          {t("newProject")}
        </Link>
      </div>

      <div className="space-y-3 flex-1">
        {projects.map((project) => {
          const colorClass =
            statusColors[project.status] ??
            "bg-slate-500/10 text-slate-600 border-slate-500/20";
          const dueDateStr = project.targetDeliveryDate
            ? new Date(project.targetDeliveryDate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })
            : "-";

          return (
            <div key={project.id} className="flex items-center gap-3 group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${colorClass}`}
              >
                <FolderKanban className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {project.title}
                </h4>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {t("dueDateLabel")} {dueDateStr}
                </p>
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">
            {t("noRecentProjects")}
          </p>
        )}
      </div>
    </div>
  );
}
