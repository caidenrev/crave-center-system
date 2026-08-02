"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

export function AdminActivityChart() {
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");
  const t = useTranslations("AdminActivity");

  const weeklyData = [
    { label: "Mon", req: 40, comp: 25 },
    { label: "Tue", req: 65, comp: 50 },
    { label: "Wed", req: 85, comp: 70 },
    { label: "Thu", req: 55, comp: 45 },
    { label: "Fri", req: 95, comp: 80 },
    { label: "Sat", req: 30, comp: 20 },
    { label: "Sun", req: 45, comp: 35 },
  ];

  const monthlyData = [
    { label: "Jan", req: 60, comp: 45 },
    { label: "Feb", req: 75, comp: 60 },
    { label: "Mar", req: 90, comp: 85 },
    { label: "Apr", req: 70, comp: 65 },
    { label: "May", req: 100, comp: 90 },
    { label: "Jun", req: 80, comp: 75 },
  ];

  const currentData = viewMode === "weekly" ? weeklyData : monthlyData;

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
      <div className="h-44 md:h-52 flex items-end justify-between gap-2 md:gap-4 pt-4 px-2">
        <AnimatePresence>
          {currentData.map((item, index) => (
            <div key={item.label + viewMode} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                {/* Job Requests Bar (Blue) */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${item.req}%`, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="w-1/2 bg-blue-600 dark:bg-blue-500 rounded-t-lg relative group-hover:bg-blue-500 transition-colors shadow-xs"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-1.5 rounded-md whitespace-nowrap pointer-events-none z-20 font-bold shadow-lg">
                    {item.req} Req
                  </div>
                </motion.div>

                {/* Completed Tasks Bar (Emerald) */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${item.comp}%`, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 + 0.02 }}
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
          ))}
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
