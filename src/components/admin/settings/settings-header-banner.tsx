"use client"

import { Camera, Loader2, Zap } from "lucide-react"
import { getDefaultAvatar } from "@/lib/utils"

interface SettingsHeaderBannerProps {
  name: string
  email: string
  initials: string
  avatarUrl: string | null
  isUploadingAvatar: boolean
  onUploadClick: () => void
  uploadLabel: string
  roleBadgeLabel?: string
}

export function SettingsHeaderBanner({
  name,
  email,
  initials,
  avatarUrl,
  isUploadingAvatar,
  onUploadClick,
  uploadLabel,
  roleBadgeLabel,
}: SettingsHeaderBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 text-white shadow-xl">
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-800 shadow-lg overflow-hidden">
              <img
                src={avatarUrl || getDefaultAvatar(name || email || 'default')}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={onUploadClick}
              disabled={isUploadingAvatar}
              className="absolute -bottom-1 -right-1 p-2 bg-primary hover:bg-primary/90 text-white rounded-full shadow-md transition-transform transform hover:scale-105 cursor-pointer disabled:opacity-50"
              title={uploadLabel}
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
              {roleBadgeLabel || "Super Admin Authorized"}
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">{name}</h2>
            <p className="text-sm text-slate-400 font-mono mt-0.5">{email}</p>
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
  )
}
