import { getTranslations } from "next-intl/server";
import { FolderKanban, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProjectItem {
  id: string;
  title: string;
  status: string;
  targetDeliveryDate: Date | null;
}

const statusColors: Record<string, string> = {
  REQUESTED: "bg-blue-500 text-white",
  WORKER_REVIEW: "bg-violet-500 text-white",
  PENDING_DP: "bg-amber-500 text-white",
  IN_PROGRESS: "bg-emerald-500 text-white",
  ON_HOLD: "bg-rose-500 text-white",
  IN_WARRANTY: "bg-cyan-500 text-white",
  COMPLETED: "bg-slate-500 text-white",
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span>{t("viewAll") || "Lihat Semua"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3 flex-1">
        {projects.map((project) => {
          const colorClass =
            statusColors[project.status] ??
            "bg-slate-500 text-white";
          const dueDateStr = project.targetDeliveryDate
            ? new Date(project.targetDeliveryDate).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                day: "numeric",
                month: "short",
              })
            : "-";

          return (
            <div key={project.id} className="flex items-center gap-3 group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${colorClass}`}
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
