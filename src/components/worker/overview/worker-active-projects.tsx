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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
      case "In Progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-2xs border-none shrink-0">
            {t("statusInProgress") || t("inProgress") || "Berlangsung"}
          </span>
        );
      case "WORKER_REVIEW":
      case "Worker Review":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-2xs border-none shrink-0">
            {t("statusWorkerReview") || "Worker Review"}
          </span>
        );
      case "PENDING_DP":
      case "Pending DP":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500 text-white shadow-2xs border-none shrink-0">
            {t("statusPendingDP") || "Menunggu DP"}
          </span>
        );
      case "COMPLETED":
      case "Completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-2xs border-none shrink-0">
            {t("statusCompleted") || "Selesai"}
          </span>
        );
      case "ON_HOLD":
      case "On Hold":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white shadow-2xs border-none shrink-0">
            {t("statusOnHold") || "Tertunda"}
          </span>
        );
      case "IN_WARRANTY":
      case "Warranty":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-white shadow-2xs border-none shrink-0">
            {t("statusInWarranty") || "Garansi"}
          </span>
        );
      case "REQUESTED":
      case "Requested":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white shadow-2xs border-none shrink-0">
            {t("statusRequested") || "Diajukan"}
          </span>
        );
      case "CANCELLED":
      case "Cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-2xs border-none shrink-0">
            {t("statusCancelled") || "Dibatalkan"}
          </span>
        );
      default:
        // Format raw status string cleanly e.g. WORKER_REVIEW -> Worker Review
        const formatted = status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-700 text-white shadow-2xs border-none shrink-0">
            {formatted}
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col h-full">
      <div className="flex items-start justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          {t("myActiveProjects")}
        </h3>
        <Link
          href={`/${locale}/worker/projects`}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
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
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {proj.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {t("client")}: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{proj.client}</strong>
                  </p>
                </div>
                {getStatusBadge(proj.status)}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* Mini arch gauge */}
                  <div className="relative w-8 h-4 flex items-end justify-center shrink-0">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="16" strokeLinecap="round" />
                      {proj.progress > 0 && (
                        <path
                          d="M 10 50 A 40 40 0 0 1 90 50"
                          fill="none"
                          className={proj.progress === 100 ? "stroke-emerald-500" : "stroke-blue-500"}
                          strokeWidth="16"
                          strokeLinecap="round"
                          strokeDasharray={`${(proj.progress / 100) * (Math.PI * 40)} ${Math.PI * 40}`}
                        />
                      )}
                    </svg>
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {proj.progress}%
                  </span>
                  
                  {proj.status === "WORKER_REVIEW" && (
                    <Link
                      href={`/${locale}/worker/projects`}
                      className="ml-2 px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-md transition-colors"
                    >
                      Ubah Penawaran
                    </Link>
                  )}
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
