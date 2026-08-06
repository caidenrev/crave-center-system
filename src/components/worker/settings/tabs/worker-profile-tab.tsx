"use client"

import { useState, RefObject } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Camera, Loader2, Lock, Save } from "lucide-react"
import { toast } from "sonner"
import { updateWorkerProfile } from "@/app/actions/worker"
import { createClient } from "@/utils/supabase/client"
import { getDefaultAvatar } from "@/lib/utils"

interface WorkerProfileTabProps {
  user: {
    id: string
    name: string
    email: string
    phone: string
    category: string
    initials: string
    avatarUrl?: string | null
  }
  avatarUrl: string | null
  setAvatarUrl: (url: string | null) => void
  isUploadingAvatar: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
}

export function WorkerProfileTab({
  user,
  avatarUrl,
  setAvatarUrl,
  isUploadingAvatar,
  fileInputRef,
}: WorkerProfileTabProps) {
  const t = useTranslations("WorkerSettings")
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [category, setCategory] = useState(user.category || "IT")
  const [isSaving, setIsSaving] = useState(false)

  // Avatar Selection Mode: 'CUSTOM' vs 'PRESET'
  const [avatarMode, setAvatarMode] = useState<'CUSTOM' | 'PRESET'>(
    avatarUrl && avatarUrl.startsWith('/profile-pict/') ? 'PRESET' : 'CUSTOM'
  )
  const [selectedPreset, setSelectedPreset] = useState<string>(
    avatarUrl && avatarUrl.startsWith('/profile-pict/') ? avatarUrl : '/profile-pict/emoji-1.jpeg'
  )

  const presetAvatars = [
    { id: 'emoji-1', path: '/profile-pict/emoji-1.jpeg', gender: 'MALE', label: 'Male 1' },
    { id: 'emoji-2', path: '/profile-pict/emoji-2.jpeg', gender: 'MALE', label: 'Male 2' },
    { id: 'emoji-5', path: '/profile-pict/emoji-5.jpeg', gender: 'MALE', label: 'Male 3' },
    { id: 'emoji-3', path: '/profile-pict/emoji-3.jpeg', gender: 'FEMALE', label: 'Female 1' },
    { id: 'emoji-4', path: '/profile-pict/emoji-4.jpeg', gender: 'FEMALE', label: 'Female 2' },
    { id: 'emoji-6', path: '/profile-pict/emoji-6.jpeg', gender: 'FEMALE', label: 'Female 3' },
    { id: 'emoji-7', path: '/profile-pict/emoji-7.jpeg', gender: 'NEUTRAL', label: 'Neutral' },
  ]

  const handleSelectPreset = (path: string) => {
    setSelectedPreset(path)
    setAvatarUrl(path)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const finalAvatar = avatarMode === 'PRESET' ? selectedPreset : avatarUrl

      const res = await updateWorkerProfile({
        name,
        phone,
        category,
        image: finalAvatar,
      })

      if (res.success) {
        toast.success(t("profileSaved"))
      } else {
        toast.error(res.error || t("profileError"))
      }
    } catch {
      toast.error(t("profileError"))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAvatar = async () => {
    try {
      setAvatarUrl(null)
      const supabase = createClient()
      await supabase.auth.updateUser({ data: { avatar_url: null } })
      toast.success(t("avatarDeleted"))
    } catch {
      toast.error(t("avatarError"))
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
        {/* Profile Picture Card */}
        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-4">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-800 overflow-hidden shrink-0 shadow-md">
              <img src={avatarUrl || getDefaultAvatar(user.name || user.email || 'default')} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t("workerAvatar")}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("avatarHint")}</p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <button
              type="button"
              onClick={() => setAvatarMode('CUSTOM')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                avatarMode === 'CUSTOM'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {t('useCustomPhoto')}
            </button>
            <button
              type="button"
              onClick={() => {
                setAvatarMode('PRESET')
                setAvatarUrl(selectedPreset)
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                avatarMode === 'PRESET'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {t('use3dAvatar')}
            </button>
          </div>

          {/* Mode 1: Custom Photo Upload */}
          {avatarMode === 'CUSTOM' && (
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="px-3.5 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUploadingAvatar ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t("saving")}
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
                  onClick={handleDeleteAvatar}
                  className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/30 text-xs font-medium rounded-xl transition-all cursor-pointer"
                >
                  {t("deleteImage")}
                </button>
              )}
            </div>
          )}

          {/* Mode 2: 3D Preset Selection Grid */}
          {avatarMode === 'PRESET' && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{t('select3dAvatar')}</span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                {presetAvatars.map((preset) => {
                  const isSelected = selectedPreset === preset.path
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.path)}
                      className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all cursor-pointer p-0.5 ${
                        isSelected 
                          ? 'border-primary ring-2 ring-primary/30 scale-105 shadow-md' 
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.path} alt={preset.label} className="w-full h-full object-cover rounded-xl" />
                      <span className="absolute bottom-1 right-1 px-1 rounded bg-slate-900/80 text-[8px] font-extrabold text-white uppercase">
                        {preset.gender === 'MALE' ? 'M' : preset.gender === 'FEMALE' ? 'F' : 'N'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Input Fields */}
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

          <div className="space-y-2">
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("category")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            >
              <option value="IT">{t("catIT")}</option>
              <option value="NON_IT">{t("catNonIT")}</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer transform hover:-translate-y-0.5"
          >
            {isSaving ? (
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
