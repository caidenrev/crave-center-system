import { ArrowUpRight, ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  title: string;
  value: number;
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

  return (
    <div
      className={
        isPrimary
          ? "bg-primary text-white rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden"
          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm"
      }
    >
      <div className="flex justify-between items-start mb-6">
        <span
          className={`font-medium text-sm md:text-base ${
            isPrimary ? "text-white/90" : "text-slate-700 dark:text-slate-300"
          }`}
        >
          {title}
        </span>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isPrimary
              ? "bg-white shadow-sm"
              : "border border-slate-200 dark:border-slate-700"
          }`}
        >
          <ArrowUpRight
            className={`w-4 h-4 ${
              isPrimary
                ? "text-primary stroke-[2.5]"
                : "text-slate-600 dark:text-slate-400"
            }`}
          />
        </div>
      </div>
      <div>
        <h3
          className={`text-4xl md:text-5xl font-semibold mb-4 tracking-tight ${
            isPrimary ? "text-white" : "text-slate-900 dark:text-white"
          }`}
        >
          {value}
        </h3>
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md ${
              isPrimary
                ? "text-white/90 bg-white/10"
                : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <BadgeIcon className="w-3.5 h-3.5" /> {badgeText}
          </div>
          {action && (
            <Link
              href={action.href}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
            >
              {action.label} <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
