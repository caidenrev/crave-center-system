import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

export interface AlertCardProps {
  icon: LucideIcon;
  iconClassName: string;
  title: string;
  description: string;
  linkHref: string;
  linkLabel: string;
  linkClassName?: string;
}

export function AlertCard({
  icon: Icon,
  iconClassName,
  title,
  description,
  linkHref,
  linkLabel,
  linkClassName = "bg-primary hover:bg-primary/90",
}: AlertCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl shrink-0 ${iconClassName}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <Link
        href={linkHref}
        className={`w-full py-2.5 rounded-xl ${linkClassName} text-white font-medium text-xs flex justify-center items-center gap-1.5 transition-colors cursor-pointer`}
      >
        {linkLabel} <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
