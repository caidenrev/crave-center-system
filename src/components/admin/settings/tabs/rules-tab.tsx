"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { CheckCircle2, Clock, Loader2, Save, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

export function RulesTab() {
  const t = useTranslations("AdminSettings")
  const [autoHoldDays, setAutoHoldDays] = useState(3)
  const [autoApproveDays, setAutoApproveDays] = useState(14)
  const [gatekeeperEnabled, setGatekeeperEnabled] = useState(true)
  const [isSavingRules, setIsSavingRules] = useState(false)

  const handleRulesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingRules(true)
    setTimeout(() => {
      setIsSavingRules(false)
      toast.success(t("profileSaved"))
    }, 600)
  }

  return (
    <motion.div
      key="rules"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("rulesTitle")}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t("rulesDesc")}
        </p>
      </div>

      <form onSubmit={handleRulesSubmit} className="space-y-6 pt-2">
        <div className="space-y-4">
          {/* Rule 1: Auto-Hold */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>{t("autoHold")}</span>
              </div>
              <span className="px-3 py-1 rounded-xl bg-primary/10 text-primary font-mono font-bold text-xs">
                {autoHoldDays} {t("days")}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("autoHoldDesc")}
            </p>
            <input
              type="range"
              min={1}
              max={14}
              value={autoHoldDays}
              onChange={(e) => setAutoHoldDays(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Rule 2: Deliverable Auto-Approval */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t("autoApprove")}</span>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 font-mono font-bold text-xs">
                {autoApproveDays} {t("days")}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("autoApproveDesc")}
            </p>
            <input
              type="range"
              min={3}
              max={30}
              value={autoApproveDays}
              onChange={(e) => setAutoApproveDays(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Rule 3: Gatekeeper Final File Security */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
            <div className="pr-4 space-y-1">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>{t("gatekeeper")}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("gatekeeperDesc")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setGatekeeperEnabled(!gatekeeperEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 ${
                gatekeeperEnabled ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <motion.div
                className="w-4 h-4 rounded-full bg-white shadow-xs"
                animate={{ x: gatekeeperEnabled ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSavingRules}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer transform hover:-translate-y-0.5"
          >
            {isSavingRules ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("saving")}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t("saveProfile")}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
