"use client";

import { X, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { TaskItem } from "./task-item-card";

interface TaskDetailModalProps {
  task: TaskItem;
  updatingTaskId: string | null;
  onClose: () => void;
  onUpdateStatus: (taskId: string, newStatus: string) => void;
}

export function TaskDetailModal({
  task,
  updatingTaskId,
  onClose,
  onUpdateStatus,
}: TaskDetailModalProps) {
  const t = useTranslations("WorkerDashboard");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "TO_DO":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {t("toDo")}
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
            {t("inProgress")}
          </span>
        );
      case "REVIEW":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
            {t("review")}
          </span>
        );
      case "DONE":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
            {t("done")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {status}
          </span>
        );
    }
  };

  const formattedDeadline = task.deadline
    ? new Date(task.deadline).toISOString().split("T")[0].split("-").reverse().join("/")
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 md:p-8 max-w-lg w-full shadow-2xl relative flex flex-col border border-slate-200 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pr-6 mb-6">
          <div className="mb-3">{getStatusBadge(task.status)}</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {task.title}
          </h3>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            {task.projectTitle} • {task.clientName}
          </p>
        </div>

        {/* Interactive Status Update Selector */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
            Ubah Status Tugas
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "TO_DO", label: t("toDo"), activeClass: "bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900" },
              { id: "IN_PROGRESS", label: t("inProgress"), activeClass: "bg-blue-600 text-white shadow-md shadow-blue-500/20" },
              { id: "REVIEW", label: t("review"), activeClass: "bg-amber-500 text-white shadow-md shadow-amber-500/20" },
              { id: "DONE", label: t("done"), activeClass: "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" },
            ].map((st) => {
              const isActive = task.status === st.id;
              const isUpdatingThis = updatingTaskId === task.id;
              return (
                <button
                  key={st.id}
                  disabled={isUpdatingThis}
                  onClick={() => onUpdateStatus(task.id, st.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isActive
                      ? st.activeClass
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {isActive && <Check className="w-3.5 h-3.5 shrink-0" />}
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {task.description && (
          <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          {task.estimatedTime && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                Estimated
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {task.estimatedTime} hours
              </p>
            </div>
          )}
          {formattedDeadline && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                Deadline
              </p>
              <p
                suppressHydrationWarning
                className="text-sm font-semibold text-slate-900 dark:text-white"
              >
                {formattedDeadline}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
