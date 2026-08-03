"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface WorkerTaskDonutProps {
  locale: string;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  reviewTasks: number;
  doneTasks: number;
}

export function WorkerTaskDonut({
  locale,
  totalTasks = 0,
  todoTasks = 0,
  inProgressTasks = 0,
  reviewTasks = 0,
  doneTasks = 0,
}: WorkerTaskDonutProps) {
  const t = useTranslations("WorkerDashboard");

  const radius = 80;
  const circum = Math.PI * radius;
  const total = totalTasks || 1;

  const donePct = doneTasks / total;
  const inProgressPct = inProgressTasks / total;
  const reviewPct = reviewTasks / total;
  // todoPct fills the rest (hatched bg)

  const doneLength = donePct * circum;
  const doneAndInProgressLength = (donePct + inProgressPct) * circum;
  const doneInProgressAndReviewLength = (donePct + inProgressPct + reviewPct) * circum;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white tracking-tight">
            {t("taskProgress")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t("taskBreakdown")}
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          {totalTasks} Tasks
        </span>
      </div>

      {/* Arch Gauge */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative w-full max-w-[280px] aspect-[2/1.2]">
          <svg className="w-full h-full drop-shadow-xs" viewBox="0 0 200 120">
            <defs>
              <pattern
                id="hatch-worker"
                width="8"
                height="8"
                patternTransform="rotate(45)"
                patternUnits="userSpaceOnUse"
                className="text-slate-300 dark:text-slate-600"
              >
                <line
                  x1="0" y1="0" x2="0" y2="8"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </pattern>
            </defs>
            {/* Base (To Do / hatched) */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#hatch-worker)"
              strokeWidth="24"
              strokeLinecap="round"
            />
            {/* Review (amber) */}
            {doneInProgressAndReviewLength > 0 && (
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                className="stroke-amber-400 transition-all duration-1000 ease-out"
                strokeWidth="24"
                strokeLinecap="round"
                strokeDasharray={`${doneInProgressAndReviewLength} ${circum}`}
              />
            )}
            {/* In Progress (blue-500) */}
            {doneAndInProgressLength > 0 && (
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                className="stroke-blue-500 transition-all duration-1000 ease-out"
                strokeWidth="24"
                strokeLinecap="round"
                strokeDasharray={`${doneAndInProgressLength} ${circum}`}
              />
            )}
            {/* Done (emerald) */}
            {doneLength > 0 && (
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                className="stroke-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="24"
                strokeLinecap="round"
                strokeDasharray={`${doneLength} ${circum}`}
              />
            )}
          </svg>

          {/* Center Text */}
          <div className="absolute bottom-4 inset-x-0 flex flex-col items-center text-center">
            <span className="text-5xl font-semibold text-slate-900 dark:text-white tracking-tight leading-none mb-1">
              {Math.round(donePct * 100)}%
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {t("done")}
            </span>
          </div>
        </div>
      </div>

      {/* Legend & Action */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t("done")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-500" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t("inProgress")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t("review")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded-full text-slate-300 dark:text-slate-600"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, currentColor, currentColor 2px, transparent 2px, transparent 6px)",
              }}
            />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t("toDo")}</span>
          </div>
        </div>

        <Link
          href={`/${locale}/worker/tasks`}
          className="w-full py-2.5 rounded-xl text-primary font-semibold text-sm flex justify-center items-center gap-1 hover:bg-primary/5 transition-colors cursor-pointer"
        >
          {t("manageTasksLink")} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
