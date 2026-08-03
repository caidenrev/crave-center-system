"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

interface NotificationToggleItemProps {
  title: string
  description: string
  enabled: boolean
  onToggle: () => void
}

function NotificationToggleItem({
  title,
  description,
  enabled,
  onToggle,
}: NotificationToggleItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
      <div className="pr-4">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 ${
          enabled ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <motion.div
          className="w-4 h-4 rounded-full bg-white shadow-xs"
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  )
}

export function NotificationsTab() {
  const t = useTranslations("AdminSettings")
  const [notif1, setNotif1] = useState(true)
  const [notif2, setNotif2] = useState(true)
  const [notif3, setNotif3] = useState(true)
  const [notif4, setNotif4] = useState(false)
  const [isSavingNotifs, setIsSavingNotifs] = useState(false)

  const handleNotifSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingNotifs(true)
    setTimeout(() => {
      setIsSavingNotifs(false)
      toast.success(t("profileSaved"))
    }, 600)
  }

  const notifItems = [
    { id: "notif1", title: t("notif1Title"), desc: t("notif1Desc"), value: notif1, setter: setNotif1 },
    { id: "notif2", title: t("notif2Title"), desc: t("notif2Desc"), value: notif2, setter: setNotif2 },
    { id: "notif3", title: t("notif3Title"), desc: t("notif3Desc"), value: notif3, setter: setNotif3 },
    { id: "notif4", title: t("notif4Title"), desc: t("notif4Desc"), value: notif4, setter: setNotif4 },
  ]

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

      <form onSubmit={handleNotifSubmit} className="space-y-4 pt-2">
        <div className="space-y-3">
          {notifItems.map((item) => (
            <NotificationToggleItem
              key={item.id}
              title={item.title}
              description={item.desc}
              enabled={item.value}
              onToggle={() => item.setter(!item.value)}
            />
          ))}
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSavingNotifs}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer transform hover:-translate-y-0.5"
          >
            {isSavingNotifs ? (
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
