"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Eye, EyeOff, Key, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function SecurityTab() {
  const t = useTranslations("AdminSettings")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [isSavingSecurity, setIsSavingSecurity] = useState(false)

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword) {
      toast.error(t("fillAllFields"))
      return
    }
    if (newPassword.length < 6) {
      toast.error(t("passwordMinLength"))
      return
    }

    setIsSavingSecurity(true)
    setTimeout(() => {
      setIsSavingSecurity(false)
      setCurrentPassword("")
      setNewPassword("")
      toast.success(t("passwordUpdated"))
    }, 800)
  }

  return (
    <motion.div
      key="security"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("securityTitle")}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t("securityDesc")}
        </p>
      </div>

      <form onSubmit={handleSecuritySubmit} className="space-y-6 pt-2">
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("currentPassword")}
            </label>
            <div className="relative">
              <input
                type={showCurrentPass ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("newPassword")}
            </label>
            <div className="relative">
              <input
                type={showNewPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSavingSecurity}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer transform hover:-translate-y-0.5"
          >
            {isSavingSecurity ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("updatingPassword")}
              </>
            ) : (
              <>
                <Key className="w-4 h-4" />
                {t("updatePassword")}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
