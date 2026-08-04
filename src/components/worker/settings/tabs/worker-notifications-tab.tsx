"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

export function WorkerNotificationsTab() {
  const t = useTranslations("WorkerSettings")

  return (
    <motion.div
      key="notifications"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("notifTitle")}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t("notifDesc")}
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t("notif1Title")}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("notif1Desc")}</p>
          </div>
          <input type="checkbox" defaultChecked className="toggle-checkbox w-4 h-4 rounded text-primary" />
        </div>

        <div className="flex items-center justify-between p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t("notif2Title")}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("notif2Desc")}</p>
          </div>
          <input type="checkbox" defaultChecked className="toggle-checkbox w-4 h-4 rounded text-primary" />
        </div>

        <div className="flex items-center justify-between p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t("notif3Title")}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("notif3Desc")}</p>
          </div>
          <input type="checkbox" defaultChecked className="toggle-checkbox w-4 h-4 rounded text-primary" />
        </div>

        <div className="flex items-center justify-between p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t("notif4Title")}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("notif4Desc")}</p>
          </div>
          <input type="checkbox" defaultChecked className="toggle-checkbox w-4 h-4 rounded text-primary" />
        </div>
      </div>
    </motion.div>
  )
}
