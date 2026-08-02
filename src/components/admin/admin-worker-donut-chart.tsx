"use client";

import { Users, ChevronRight, CheckCircle2, Clock, Coffee } from "lucide-react";
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
  awayWorkers = 0,
}: WorkerDonutChartProps) {
  const t = useTranslations("AdminDonut");

  // Compute percentages
  const availablePercent =
    totalWorkers > 0 ? Math.round((availableWorkers / totalWorkers) * 100) : 0;
  const busyPercent =
    totalWorkers > 0 ? Math.round((busyWorkers / totalWorkers) * 100) : 0;
  const awayPercent =
    totalWorkers > 0 ? Math.round((awayWorkers / totalWorkers) * 100) : 0;

  // SVG Donut calculation (radius = 36, circumference ~ 226.19)
  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  const strokeDashAvailable = (availablePercent / 100) * circumference;
  const strokeDashBusy = (busyPercent / 100) * circumference;
  const strokeDashAway = (awayPercent / 100) * circumference;

  const offsetAvailable = 0;
  const offsetBusy = strokeDashAvailable;
  const offsetAway = strokeDashAvailable + strokeDashBusy;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-500/20 shadow-xs">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight truncate">
                {t("title")}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {t("subtitle")}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 whitespace-nowrap shrink-0">
            {t("membersBadge", { count: totalWorkers })}
          </span>
        </div>

        {/* Compact Donut Visual & 3-Status Legend */}
        <div className="flex flex-col items-center justify-center my-3 space-y-3">
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800/80"
                strokeWidth="10"
                fill="none"
              />

              {/* 1. Available segment (Emerald) */}
              {availablePercent > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-emerald-500 transition-all duration-700"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${strokeDashAvailable} ${circumference}`}
                  strokeDashoffset={`-${offsetAvailable}`}
                  strokeLinecap="round"
                />
              )}

              {/* 2. Busy segment (Rose) */}
              {busyPercent > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-rose-500 transition-all duration-700"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${strokeDashBusy} ${circumference}`}
                  strokeDashoffset={`-${offsetBusy}`}
                  strokeLinecap="round"
                />
              )}

              {/* 3. Away segment (Amber) */}
              {awayPercent > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="stroke-amber-500 transition-all duration-700"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${strokeDashAway} ${circumference}`}
                  strokeDashoffset={`-${offsetAway}`}
                  strokeLinecap="round"
                />
              )}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {totalWorkers}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {t("workersCenter")}
              </span>
            </div>
          </div>

          {/* 3-Status Legend Cards */}
          <div className="w-full space-y-2">
            {/* Available */}
            <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t("availableTitle")}
                  </h4>
                  <p className="text-[10px] text-slate-400">{t("availableDesc")}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {availableWorkers}
                </span>
                <span className="text-[10px] text-emerald-500 font-bold ml-1">
                  ({availablePercent}%)
                </span>
              </div>
            </div>

            {/* Busy */}
            <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-xl bg-rose-500/10 text-rose-500">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t("busyTitle")}
                  </h4>
                  <p className="text-[10px] text-slate-400">{t("busyDesc")}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {busyWorkers}
                </span>
                <span className="text-[10px] text-rose-500 font-bold ml-1">
                  ({busyPercent}%)
                </span>
              </div>
            </div>

            {/* Away */}
            <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-xl bg-amber-500/10 text-amber-500">
                  <Coffee className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {t("awayTitle")}
                  </h4>
                  <p className="text-[10px] text-slate-400">{t("awayDesc")}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {awayWorkers}
                </span>
                <span className="text-[10px] text-amber-500 font-bold ml-1">
                  ({awayPercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <Link
          href={`/${locale}/admin/team`}
          className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex justify-center items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {t("manageTeam")} <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
