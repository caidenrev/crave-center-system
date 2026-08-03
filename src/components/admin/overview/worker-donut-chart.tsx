"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface WorkerDonutChartProps {
  locale: string;
  totalWorkers: number;
  availableWorkers: number;
  busyWorkers: number;
  awayWorkers: number;
}

export function AdminWorkerDonutChart({
  locale,
  totalWorkers = 0,
  availableWorkers = 0,
  busyWorkers = 0,
}: WorkerDonutChartProps) {
  const t = useTranslations("AdminDonut");

  // Arch SVG calculation (radius = 80, circumference ~ 251.327)
  const radius = 80;
  const circum = Math.PI * radius;

  const total = totalWorkers || 1;
  const availablePct = availableWorkers / total;
  const busyPct = busyWorkers / total;

  const availableLength = availablePct * circum;
  const busyLength = busyPct * circum;
  const availableAndBusyLength = availableLength + busyLength;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header - Minimalist */}
      <div className="flex items-start justify-between mb-8">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white tracking-tight">
          {t("title")}
        </h3>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          {t("membersBadge", { count: totalWorkers })}
        </span>
      </div>

      {/* Arch Gauge */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative w-full max-w-[280px] aspect-[2/1.2]">
          <svg className="w-full h-full drop-shadow-xs" viewBox="0 0 200 120">
            <defs>
              <pattern
                id="hatch"
                width="8"
                height="8"
                patternTransform="rotate(45)"
                patternUnits="userSpaceOnUse"
                className="text-slate-300 dark:text-slate-600"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </pattern>
            </defs>
            {/* Base Hatched Arch (Away/Empty) */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#hatch)"
              strokeWidth="24"
              strokeLinecap="round"
            />
            {/* Dark Blue (Available + Busy) */}
            {availableAndBusyLength > 0 && (
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                className="stroke-blue-800 dark:stroke-blue-900 transition-all duration-1000 ease-out"
                strokeWidth="24"
                strokeLinecap="round"
                strokeDasharray={`${availableAndBusyLength} ${circum}`}
              />
            )}
            {/* Light Blue (Available) */}
            {availableLength > 0 && (
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                className="stroke-blue-500 transition-all duration-1000 ease-out"
                strokeWidth="24"
                strokeLinecap="round"
                strokeDasharray={`${availableLength} ${circum}`}
              />
            )}
          </svg>

          {/* Center Text */}
          <div className="absolute bottom-4 inset-x-0 flex flex-col items-center text-center">
            <span className="text-5xl font-semibold text-slate-900 dark:text-white tracking-tight leading-none mb-1">
              {Math.round(availablePct * 100)}%
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {t("availableTitle")}
            </span>
          </div>
        </div>
      </div>

      {/* Legend & Action */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-6 px-2">
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t("availableTitle").split(" ")[0]}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-800 dark:bg-blue-900" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t("busyTitle").split(" ")[0]}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <div
                className="w-3.5 h-3.5 rounded-full text-slate-300 dark:text-slate-600"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, currentColor, currentColor 2px, transparent 2px, transparent 6px)",
                }}
              />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{t("awayTitle").split(" ")[0]}</span>
            </div>
          </div>
        </div>

        <Link
          href={`/${locale}/admin/team`}
          className="w-full py-2.5 rounded-xl text-primary font-semibold text-sm flex justify-center items-center gap-1 hover:bg-primary/5 transition-colors cursor-pointer"
        >
          {t("manageTeam")} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
