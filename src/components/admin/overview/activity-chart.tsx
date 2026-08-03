"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

export interface ActivityDataItem {
  label: string;
  req: number;
  comp: number;
}

interface AdminActivityChartProps {
  weeklyData?: ActivityDataItem[];
  monthlyData?: ActivityDataItem[];
}

export function AdminActivityChart({
  weeklyData = [],
  monthlyData = [],
}: AdminActivityChartProps) {
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");
  const t = useTranslations("AdminActivity");

  const currentData = viewMode === "weekly" ? weeklyData : monthlyData;

  // Calculate max value for dynamic scaling (min max scale = 5 for aesthetics)
  const maxVal = Math.max(
    5,
    ...currentData.flatMap((d) => [d.req, d.comp])
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col justify-between h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-xs">
            <BarChart3 className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              {t("title")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {viewMode === "weekly" ? t("weeklySubtitle") : t("monthlySubtitle")}
            </p>
          </div>
        </div>

        {/* Weekly / Monthly View Mode Toggle */}
        <div className="flex items-center gap-1 text-xs bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 self-start sm:self-auto">
          <button
            onClick={() => setViewMode("weekly")}
            className={`relative px-3.5 py-1.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
              viewMode === "weekly"
                ? "text-primary dark:text-white font-bold"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
            }`}
          >
            {viewMode === "weekly" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-700/80"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {t("weeklyToggle")}
            </span>
          </button>

          <button
            onClick={() => setViewMode("monthly")}
            className={`relative px-3.5 py-1.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
              viewMode === "monthly"
                ? "text-primary dark:text-white font-bold"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
            }`}
          >
            {viewMode === "monthly" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-700/80"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {t("monthlyToggle")}
            </span>
          </button>
        </div>
      </div>

      {/* Bar Chart Bars Container */}
      <div className="h-44 md:h-52 flex items-end justify-between gap-2 md:gap-4 pt-4 px-2 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full h-full flex items-end justify-between gap-2 md:gap-4"
          >
            {currentData.map((item, index) => {
              const reqPct = Math.round((item.req / maxVal) * 100);
              const compPct = Math.round((item.comp / maxVal) * 100);

              return (
                <div
                  key={item.label}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                >
                  <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                    {/* Job Requests Bar (Blue) */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${reqPct}%` }}
                      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.03 }}
                      className="w-1/2 bg-blue-600 dark:bg-blue-500 rounded-t-lg relative group-hover:bg-blue-500 transition-colors shadow-xs"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-1.5 rounded-md whitespace-nowrap pointer-events-none z-20 font-bold shadow-lg">
                        {item.req} Req
                      </div>
                    </motion.div>

                    {/* Completed Tasks Bar (Emerald) */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${compPct}%` }}
                      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.03 + 0.02 }}
                      className="w-1/2 bg-emerald-500 dark:bg-emerald-400 rounded-t-lg relative group-hover:bg-emerald-400 transition-colors shadow-xs"
                    >
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-1.5 rounded-md whitespace-nowrap pointer-events-none z-20 font-bold shadow-lg">
                        {item.comp} Comp
                      </div>
                    </motion.div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-500" />
          <span>{t("jobRequests")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          <span>{t("completedTasks")}</span>
        </div>
      </div>
    </div>
  );
}
