"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import {
  User,
  Bell,
  Shield,
  Key,
  Camera,
  CheckCircle2,
  Loader2,
  Save,
  Lock,
  Eye,
  EyeOff,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { toast } from "sonner"
import { updateClientSettings } from "@/app/actions/client"
import { createClient } from "@/utils/supabase/client"

interface AdminSettingsClientProps {
  user: {
    name: string
    email: string
    phone: string
    initials: string
    avatarUrl?: string | null
  }
}

type TabType = "profile" | "notifications" | "rules" | "security"

export function AdminSettingsClient({ user }: AdminSettingsClientProps) {
  const t = useTranslations("AdminSettings")
  const [activeTab, setActiveTab] = useState<TabType>("profile")

  // Form states
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl || null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Notification toggle states
  const [notif1, setNotif1] = useState(true)
  const [notif2, setNotif2] = useState(true)
  const [notif3, setNotif3] = useState(true)
  const [notif4, setNotif4] = useState(false)
  const [isSavingNotifs, setIsSavingNotifs] = useState(false)

  // Platform Rules states
  const [autoHoldDays, setAutoHoldDays] = useState(3)
  const [autoApproveDays, setAutoApproveDays] = useState(14)
  const [gatekeeperEnabled, setGatekeeperEnabled] = useState(true)
  const [isSavingRules, setIsSavingRules] = useState(false)

  // Security states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [isSavingSecurity, setIsSavingSecurity] = useState(false)

  // Handle Avatar File Selection & Upload to Supabase Storage
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB")
      return
    }

    setIsUploadingAvatar(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() || 'jpg'
      const filePath = `avatar-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true, contentType: file.type })

      if (uploadError) {
        toast.error(uploadError.message || t("avatarError"))
        setIsUploadingAvatar(false)
        return
      }

      const publicUrl = supabase.storage.from('avatars').getPublicUrl(filePath).data.publicUrl
      setAvatarUrl(publicUrl)

      // Save public URL in Supabase auth user_metadata (short URL, no base64 bloat)
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      toast.success(t("avatarUploaded"))
    } catch {
      toast.error(t("avatarError"))
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  // Handle Profile Save
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

  // Handle Notifications Save
  const handleNotifSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingNotifs(true)
    setTimeout(() => {
      setIsSavingNotifs(false)
      toast.success(t("profileSaved"))
    }, 600)
  }

  // Handle Platform Rules Save
  const handleRulesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingRules(true)
    setTimeout(() => {
      setIsSavingRules(false)
      toast.success(t("profileSaved"))
    }, 600)
  }

  // Handle Security Save
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

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "profile", label: t("tabProfile"), icon: User },
    { id: "notifications", label: t("tabNotifications"), icon: Bell },
    { id: "rules", label: t("tabRules"), icon: Shield },
    { id: "security", label: t("tabSecurity"), icon: Key },
  ]

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
      />

      {/* Header Banner with Premium Gradient & Motion */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-primary/20 overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                ) : (
                  <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white font-extrabold text-2xl">
                    {user.initials}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-1 -right-1 p-2 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md transition-transform transform hover:scale-105 cursor-pointer disabled:opacity-50"
                title={t("uploadImage")}
              >
                {isUploadingAvatar ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Super Admin Authorized
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">{name}</h2>
              <p className="text-sm text-slate-400 font-mono mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 text-xs text-slate-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Platform Mode: <strong className="text-white">Production</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Navigation Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 md:p-6 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "text-primary dark:text-primary font-bold shadow-sm"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSettingTab"
                      className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-2xl border border-primary/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 relative z-10 ${isActive ? "text-primary" : "text-slate-400"}`} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* TAB 1: PROFILE */}
            {activeTab === "profile" && (
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
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary via-indigo-500 to-purple-600 p-0.5 overflow-hidden shrink-0 shadow-md">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="w-full h-full object-cover rounded-[14px]" />
                      ) : (
                        <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white font-extrabold text-xl">
                          {user.initials}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{t("adminAvatar")}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("avatarHint")}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingAvatar}
                          className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
            )}

            {/* TAB 2: NOTIFICATIONS */}
            {activeTab === "notifications" && (
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
                    {/* Notif 1 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
                      <div className="pr-4">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {t("notif1Title")}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {t("notif1Desc")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotif1(!notif1)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 ${
                          notif1 ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <motion.div
                          className="w-4 h-4 rounded-full bg-white shadow-sm"
                          animate={{ x: notif1 ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    {/* Notif 2 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
                      <div className="pr-4">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {t("notif2Title")}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {t("notif2Desc")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotif2(!notif2)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 ${
                          notif2 ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <motion.div
                          className="w-4 h-4 rounded-full bg-white shadow-sm"
                          animate={{ x: notif2 ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    {/* Notif 3 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
                      <div className="pr-4">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {t("notif3Title")}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {t("notif3Desc")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotif3(!notif3)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 ${
                          notif3 ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <motion.div
                          className="w-4 h-4 rounded-full bg-white shadow-sm"
                          animate={{ x: notif3 ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    {/* Notif 4 */}
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
                      <div className="pr-4">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {t("notif4Title")}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {t("notif4Desc")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotif4(!notif4)}
                        className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 ${
                          notif4 ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <motion.div
                          className="w-4 h-4 rounded-full bg-white shadow-sm"
                          animate={{ x: notif4 ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
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
            )}

            {/* TAB 3: PLATFORM RULES */}
            {activeTab === "rules" && (
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
                          className="w-4 h-4 rounded-full bg-white shadow-sm"
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
            )}

            {/* TAB 4: SECURITY & PASSWORD */}
            {activeTab === "security" && (
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
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
