import { ArrowUpRight, ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: number | string;
  badgeIcon: LucideIcon;
  badgeText: string;
  variant?: "primary" | "default";
  action?: { href: string; label: string };
}

export function StatCard({
  title,
  value,
  badgeIcon: BadgeIcon,
  badgeText,
  variant = "default",
  action,
}: StatCardProps) {
  const isPrimary = variant === "primary";
  const valStr = String(value);
  const isVeryLong = valStr.length > 12;
  const isLong = valStr.length > 7;

  const valueFontSize = isVeryLong
    ? "text-xl md:text-2xl"
    : isLong
    ? "text-2xl md:text-3xl"
    : "text-4xl md:text-5xl";

  return (
    <div
      className={
        isPrimary
          ? "bg-primary text-white rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden flex flex-col justify-between"
          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between"
      }
    >
      <div className="flex justify-between items-start mb-3">
        <span
          className={`font-medium text-xs truncate pr-1 ${
            isPrimary ? "text-white/90" : "text-slate-700 dark:text-slate-300"
          }`}
        >
          {title}
        </span>
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
            isPrimary
              ? "bg-white shadow-xs"
              : "border border-slate-200 dark:border-slate-700"
          }`}
        >
          <ArrowUpRight
            className={`w-3 h-3 ${
              isPrimary
                ? "text-primary stroke-[2.5]"
                : "text-slate-600 dark:text-slate-400"
            }`}
          />
        </div>
      </div>
      <div>
        <h3
          className={`${valueFontSize} font-extrabold mb-3 tracking-tight truncate ${
            isPrimary ? "text-white" : "text-slate-900 dark:text-white"
          }`}
          title={valStr}
        >
          {value}
        </h3>
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <div
            className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              isPrimary
                ? "text-white/90 bg-white/10"
                : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <BadgeIcon className="w-3 h-3 shrink-0" /> {badgeText}
          </div>
          {action && (
            <Link
              href={action.href}
              className="text-[10px] sm:text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5"
            >
              {action.label} <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
