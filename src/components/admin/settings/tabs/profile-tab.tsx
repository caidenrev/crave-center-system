"use client"

import { useState, RefObject } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Camera, Loader2, Lock, Save } from "lucide-react"
import { toast } from "sonner"
import { updateClientSettings } from "@/app/actions/client"
import { createClient } from "@/utils/supabase/client"
import { getDefaultAvatar } from "@/lib/utils"

interface ProfileTabProps {
  user: {
    name: string
    email: string
    phone: string
    initials: string
    avatarUrl?: string | null
  }
  avatarUrl: string | null
  setAvatarUrl: (url: string | null) => void
  isUploadingAvatar: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
}

export function ProfileTab({
  user,
  avatarUrl,
  setAvatarUrl,
  isUploadingAvatar,
  fileInputRef,
}: ProfileTabProps) {
  const t = useTranslations("AdminSettings")
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    const formData = new FormData()
    formData.append("name", name)
    formData.append("phone", phone)

    try {
      const res = await updateClientSettings(formData)
      if (res.success) {
        toast.success(t("profileSaved"))
      } else {
        toast.error(res.error || t("profileError"))
      }
    } catch {
      toast.error(t("profileError"))
    } finally {
      setIsSavingProfile(false)
    }
  }

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("profileTitle")}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t("profileDesc")}
        </p>
      </div>

      <form onSubmit={handleProfileSubmit} className="space-y-6 pt-2">
        <div className="flex items-center gap-6 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-800 overflow-hidden shrink-0 shadow-sm">
            <img src={avatarUrl || getDefaultAvatar(user.name || user.email || 'default')} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{t("adminAvatar")}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("avatarHint")}</p>
            <div className="flex items-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUploadingAvatar ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5" />
                    {t("uploadImage")}
                  </>
                )}
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={async () => {
                    setAvatarUrl(null)
                    const supabase = createClient()
                    await supabase.auth.updateUser({ data: { avatar_url: null } })
                    toast.success(t("avatarDeleted"))
                  }}
                  className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/30 text-xs font-medium rounded-xl transition-all cursor-pointer"
                >
                  {t("deleteImage")}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("fullName")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{t("emailReadonly")}</span>
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 text-slate-500 cursor-not-allowed outline-none text-sm font-mono"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("phone")}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +62 812 3456 7890"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSavingProfile}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer transform hover:-translate-y-0.5"
          >
            {isSavingProfile ? (
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
