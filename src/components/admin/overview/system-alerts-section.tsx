import { getTranslations } from "next-intl/server";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Info,
  ShieldAlert,
} from "lucide-react";
import { AlertCard, type AlertCardProps } from "./alert-card";

interface SystemAlertsSectionProps {
  pendingApps: number;
  activeRequests: number;
  delayedProjects: number;
  locale: string;
}

export async function SystemAlertsSection({
  pendingApps,
  activeRequests,
  delayedProjects,
  locale,
}: SystemAlertsSectionProps) {
  const t = await getTranslations("AdminDashboard");
  const allClear =
    pendingApps === 0 && activeRequests === 0 && delayedProjects === 0;

  // Build alert cards data-driven — only include non-zero items
  const alerts: AlertCardProps[] = [];
  if (pendingApps > 0) {
    alerts.push({
      icon: ShieldAlert,
      iconClassName: "bg-primary/10 text-primary",
      title: t("pendingAppsTitle", { count: pendingApps }),
      description: t("pendingAppsDesc"),
      linkHref: `/${locale}/admin/applications`,
      linkLabel: t("reviewAppsBtn", { count: pendingApps }),
    });
  }
  if (activeRequests > 0) {
    alerts.push({
      icon: Clock,
      iconClassName: "bg-primary/10 text-primary",
      title: t("pendingRequestsTitle", { count: activeRequests }),
      description: t("pendingRequestsDesc"),
      linkHref: `/${locale}/admin/requests`,
      linkLabel: t("reviewRequestsBtn", { count: activeRequests }),
    });
  }
  if (delayedProjects > 0) {
    alerts.push({
      icon: AlertTriangle,
      iconClassName: "bg-amber-500/10 text-amber-600",
      title: t("delayedProjectsTitle", { count: delayedProjects }),
      description: t("delayedProjectsDesc"),
      linkHref: `/${locale}/admin/projects`,
      linkLabel: t("reviewProjectsBtn", { count: delayedProjects }),
      linkClassName: "bg-amber-500 hover:bg-amber-500/90",
    });
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-primary" />
            {t("systemAlertsTitle")}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("systemAlertsSubtitle")}
          </p>
        </div>
        <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium border border-primary/20 flex items-center gap-2 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {t("statusHealthy")}
        </span>
      </div>

      {/* Alert Content — single banner if clear, grid of cards if actionable */}
      {allClear ? (
        <div className="p-6 rounded-2xl bg-emerald-50/80 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              {t("allSystemsClearTitle")}
            </h4>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/70 mt-1 leading-relaxed">
              {t("allSystemsClearDesc")}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {alerts.map((alert) => (
            <AlertCard key={alert.linkHref} {...alert} />
          ))}
        </div>
      )}

      {/* Testing Hint */}
      <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="leading-relaxed">{t("testAlertsInfo")}</span>
      </div>
    </div>
  );
}
