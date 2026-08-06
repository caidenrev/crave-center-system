"use client";

import { useState } from "react";
import {
  Clock,
  CheckCircle2,
  Circle,
  Eye,
  Calendar,
  ChevronDown,
  Folder,
  User,
  Loader2,
  Check,
} from "lucide-react";
import { useTranslations } from "next-intl";

export interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  projectTitle: string;
  clientName: string;
  estimatedTime: number | null;
  actualTime: number | null;
  deadline: string | null;
  completedAt: string | null;
  createdAt: string;
}

interface TaskItemCardProps {
  task: TaskItem;
  index: number;
  totalCount: number;
  updatingTaskId: string | null;
  onSelectTask: (task: TaskItem) => void;
  onUpdateStatus: (taskId: string, newStatus: string) => void;
  onToggleQuickStatus: (e: React.MouseEvent, task: TaskItem) => void;
}

export function TaskItemCard({
  task,
  index,
  totalCount,
  updatingTaskId,
  onSelectTask,
  onUpdateStatus,
  onToggleQuickStatus,
}: TaskItemCardProps) {
  const t = useTranslations("WorkerDashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DONE":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4 text-blue-500 shrink-0" />;
      case "REVIEW":
        return <Eye className="w-4 h-4 text-amber-500 shrink-0" />;
      default:
        return <Circle className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DONE":
        return t("done");
      case "IN_PROGRESS":
        return t("inProgress");
      case "REVIEW":
        return t("review");
      default:
        return t("toDo");
    }
  };

  const getStatusBorderAccent = (status: string) => {
    switch (status) {
      case "DONE":
        return "border-l-4 border-l-emerald-500";
      case "IN_PROGRESS":
        return "border-l-4 border-l-blue-500";
      case "REVIEW":
        return "border-l-4 border-l-amber-500";
      default:
        return "border-l-4 border-l-slate-400 dark:border-l-slate-600";
    }
  };

  const isLast = index === totalCount - 1;

  // Format date safely to avoid SSR hydration mismatch
  const formattedDeadline = task.deadline
    ? new Date(task.deadline).toISOString().split("T")[0].split("-").reverse().join("/")
    : null;

  return (
    <div className="relative flex gap-4 items-stretch group">
      {/* Vertical Timeline Flow Connector */}
      <div className="flex flex-col items-center shrink-0 pt-3 relative z-10">
        {/* Timeline Node Dot */}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all bg-white dark:bg-slate-900 ${
            task.status === "DONE"
              ? "border-emerald-500 text-emerald-500 shadow-xs shadow-emerald-500/20"
              : task.status === "IN_PROGRESS"
              ? "border-blue-500 text-blue-500 shadow-xs shadow-blue-500/20"
              : task.status === "REVIEW"
              ? "border-amber-500 text-amber-500 shadow-xs shadow-amber-500/20"
              : "border-slate-300 dark:border-slate-700 text-slate-400"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              task.status === "DONE"
                ? "bg-emerald-500"
                : task.status === "IN_PROGRESS"
                ? "bg-blue-500"
                : task.status === "REVIEW"
                ? "bg-amber-500"
                : "bg-slate-300 dark:bg-slate-600"
            }`}
          />
        </div>

        {/* Connecting Vertical Progress Line */}
        {!isLast && (
          <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 my-1 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 transition-colors" />
        )}
      </div>

      {/* Main Rectangular Task Card */}
      <div
        onClick={() => onSelectTask(task)}
        className={`flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer mb-3 ${
          isDropdownOpen ? "z-30 relative" : "relative"
        } ${getStatusBorderAccent(task.status)}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Main Left Section */}
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            {/* Quick Toggle Status Button */}
            <button
              onClick={(e) => onToggleQuickStatus(e, task)}
              disabled={updatingTaskId === task.id}
              title="Click to change status"
              className="mt-0.5 hover:scale-110 active:scale-95 transition-transform cursor-pointer p-0.5 rounded-full shrink-0"
            >
              {updatingTaskId === task.id ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0" />
              ) : (
                getStatusIcon(task.status)
              )}
            </button>

            <div className="flex-1 min-w-0 space-y-1">
              {/* Project & Client Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                  <Folder className="w-3 h-3 text-slate-400" />
                  {task.projectTitle}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  <User className="w-3 h-3 text-slate-400" />
                  {task.clientName}
                </span>
              </div>

              {/* Task Title — Clean typography without strikethrough */}
              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                {task.title}
              </h4>

              {/* Description Snippet */}
              {task.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Right Section: Badges & Status Selector */}
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center flex-wrap pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60 w-full sm:w-auto justify-between sm:justify-end">
            {/* Estimated Time Badge */}
            {task.estimatedTime && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {task.estimatedTime}h
              </span>
            )}

            {/* Deadline Badge — Hydration Safe */}
            {formattedDeadline && (
              <span
                suppressHydrationWarning
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] font-semibold text-slate-600 dark:text-slate-300"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formattedDeadline}
              </span>
            )}

            {/* Interactive Modern Custom Popover Dropdown */}
            <div onClick={(e) => e.stopPropagation()} className="relative">
              <button
                type="button"
                disabled={updatingTaskId === task.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className={`inline-flex items-center gap-2 text-xs font-extrabold px-3 py-1.5 rounded-xl border cursor-pointer transition-all shadow-2xs hover:shadow-xs active:scale-95 ${
                  task.status === "TO_DO"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    : task.status === "IN_PROGRESS"
                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30"
                    : task.status === "REVIEW"
                    ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30"
                    : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
                }`}
              >
                {getStatusIcon(task.status)}
                <span>{getStatusLabel(task.status)}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 opacity-60 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <>
                  {/* Backdrop overlay */}
                  <div
                    className="fixed inset-0 z-20 cursor-default"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(false);
                    }}
                  />

                  {/* Floating Modern Custom Menu */}
                  <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                    {[
                      { id: "TO_DO", label: t("toDo"), icon: Circle, color: "text-slate-400" },
                      { id: "IN_PROGRESS", label: t("inProgress"), icon: Clock, color: "text-blue-500" },
                      { id: "REVIEW", label: t("review"), icon: Eye, color: "text-amber-500" },
                      { id: "DONE", label: t("done"), icon: CheckCircle2, color: "text-emerald-500" },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = task.status === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDropdownOpen(false);
                            onUpdateStatus(task.id, opt.id);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${opt.color}`} />
                            <span>{opt.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
