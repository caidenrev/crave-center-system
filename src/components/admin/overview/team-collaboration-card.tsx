import { getTranslations } from "next-intl/server";
import { Hexagon, Plus } from "lucide-react";
import Link from "next/link";
import { getDefaultAvatar } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string | null;
  workerProjects: Array<{ title: string }>;
}

export async function TeamCollaborationCard({
  members,
  locale,
}: {
  members: TeamMember[];
  locale: string;
}) {
  const t = await getTranslations("AdminDashboard");

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {t("teamCollaboration")}
        </h3>
        <Link
          href={`/${locale}/admin/team`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/20 dark:border-primary/30 text-xs font-semibold text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[2.5]" />{" "}
          {t("addMember")}
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {members.map((member) => {
          const activeProject = member.workerProjects?.[0];
          const isWorking = !!activeProject;

          return (
            <div
              key={member.id}
              className="flex items-center justify-between gap-4 p-2 -mx-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 border-white dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img src={getDefaultAvatar(member.name || member.id || 'default')} alt={member.name || 'Worker'} className="w-full h-full object-cover" />
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {member.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {isWorking ? (
                      <>
                        {t("workingOn")}{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {activeProject.title}
                        </span>
                      </>
                    ) : (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {t("availableForAssignment")}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold border shrink-0 ${
                  isWorking
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                }`}
              >
                {isWorking ? t("inProgressStatus") : t("availableStatus")}
              </span>
            </div>
          );
        })}

        {members.length === 0 && (
          <p className="text-sm text-slate-500 py-4">{t("noTeamMembers")}</p>
        )}
      </div>
    </div>
  );
}
