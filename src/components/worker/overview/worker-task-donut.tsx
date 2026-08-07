"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createClient } from "@/utils/supabase/client";
import { getWorkerTaskStats } from "@/app/actions/worker";

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
  totalTasks: initialTotal = 0,
  todoTasks: initialTodo = 0,
  inProgressTasks: initialInProgress = 0,
  reviewTasks: initialReview = 0,
  doneTasks: initialDone = 0,
}: WorkerTaskDonutProps) {
  const t = useTranslations("WorkerDashboard");

  const [stats, setStats] = useState({
    total: initialTotal,
    todo: initialTodo,
    inProgress: initialInProgress,
    review: initialReview,
    done: initialDone,
  });

  const [isLive, setIsLive] = useState(false);

  const fetchLatestStats = useCallback(async () => {
    const res = await getWorkerTaskStats();
    if (res.success && res.stats) {
      setStats({
        total: res.stats.total,
        todo: res.stats.todo,
        inProgress: res.stats.inProgress,
        review: res.stats.review,
        done: res.stats.done,
      });
    }
  }, []);

  // Supabase Realtime subscription for Task updates
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const channel = supabase
      .channel("worker-task-donut-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Task",
        },
        () => {
          if (isMounted) {
            setIsLive(true);
            fetchLatestStats();
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [fetchLatestStats]);

  const radius = 80;
  const circum = Math.PI * radius;
  const total = stats.total || 1;

  const donePct = stats.total > 0 ? stats.done / total : 0;
  const inProgressPct = stats.total > 0 ? stats.inProgress / total : 0;
  const reviewPct = stats.total > 0 ? stats.review / total : 0;

  const doneLength = donePct * circum;
  const doneAndInProgressLength = (donePct + inProgressPct) * circum;
  const doneInProgressAndReviewLength = (donePct + inProgressPct + reviewPct) * circum;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-full relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t("taskProgress")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t("taskBreakdown")}
          </p>
        </div>
        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-600 text-white shadow-xs border-none">
          {stats.total} Tasks
        </span>
      </div>

      {/* Arch Gauge */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative w-full max-w-[280px] aspect-[2/1.2]">
          <svg className="w-full h-full drop-shadow-xs overflow-visible" viewBox="0 0 200 120">
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

            {/* Base Arc (Hatching To Do) */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#hatch-worker)"
              strokeWidth="24"
              strokeLinecap="round"
            />

            {/* Review Arc (Amber) */}
            {doneInProgressAndReviewLength > 0 && (
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                className="stroke-amber-400 transition-all duration-700 ease-out"
                strokeWidth="24"
                strokeLinecap="round"
                strokeDasharray={`${doneInProgressAndReviewLength} ${circum}`}
              />
            )}

            {/* In Progress Arc (Blue) */}
            {doneAndInProgressLength > 0 && (
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                className="stroke-blue-500 transition-all duration-700 ease-out"
                strokeWidth="24"
                strokeLinecap="round"
                strokeDasharray={`${doneAndInProgressLength} ${circum}`}
              />
            )}

            {/* Done Arc (Emerald) */}
            {doneLength > 0 && (
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                className="stroke-emerald-500 transition-all duration-700 ease-out"
                strokeWidth="24"
                strokeLinecap="round"
                strokeDasharray={`${doneLength} ${circum}`}
              />
            )}
          </svg>

          {/* Center Percentage Display */}
          <div className="absolute bottom-3 inset-x-0 flex flex-col items-center text-center">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">
              {Math.round(donePct * 100)}%
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("done")}
            </span>
          </div>
        </div>
      </div>

      {/* Legend & Action */}
      <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-4 gap-1 mb-5 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{stats.done}</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">{t("done")}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{stats.inProgress}</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">{t("inProgress")}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{stats.review}</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">{t("review")}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div
                className="w-2.5 h-2.5 rounded-full text-slate-400 dark:text-slate-500 shrink-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, currentColor, currentColor 2px, transparent 2px, transparent 4px)",
                }}
              />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{stats.todo}</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">{t("toDo")}</span>
          </div>
        </div>

        <Link
          href={`/${locale}/worker/tasks`}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex justify-center items-center gap-1.5 transition-all shadow-xs border-none cursor-pointer"
        >
          {t("manageTasksLink")} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
