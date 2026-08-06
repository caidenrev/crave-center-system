"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface ActiveProject {
  id: string;
  title: string;
  client: string;
  status: string;
  progress: number;
  dueDate: string | null;
}

export function WorkerActiveProjects({
  projects,
  locale,
}: {
  projects: ActiveProject[];
  locale: string;
}) {
  const t = useTranslations("WorkerDashboard");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20";
      case "ON_HOLD":
        return "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20";
      case "IN_WARRANTY":
        return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20";
      default:
        return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return t("inProgress");
      case "ON_HOLD":
        return t("statusOnHold");
      case "IN_WARRANTY":
        return t("statusInWarranty");
      default:
        return status;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-start justify-between mb-5">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white tracking-tight">
          {t("myActiveProjects")}
        </h3>
        <Link
          href={`/${locale}/worker/projects`}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
        >
          {t("viewAllProjects")} <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400 dark:text-slate-500 py-8">
          {t("noProjects")}
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {proj.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {t("client")}: {proj.client}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getStatusColor(
                    proj.status
                  )}`}
                >
                  {getStatusLabel(proj.status)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* Mini arch gauge */}
                  <div className="relative w-8 h-4 flex items-end justify-center shrink-0">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="16" strokeLinecap="round" />
                      <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        className={proj.progress === 100 ? "stroke-emerald-500" : "stroke-blue-500"}
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={`${(proj.progress / 100) * (Math.PI * 40)} ${Math.PI * 40}`}
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {proj.progress}%
                  </span>
                </div>

                {proj.dueDate && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    Due: {proj.dueDate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
