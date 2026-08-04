"use client"

import { useState, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { User, Bell, Key, Code2 } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"
import { SettingsHeaderBanner } from "@/components/admin/settings/settings-header-banner"
import { SettingsTabNav, TabItem } from "@/components/admin/settings/settings-tab-nav"
import { WorkerProfileTab } from "./tabs/worker-profile-tab"
import { WorkerSkillsTab } from "./tabs/worker-skills-tab"
import { WorkerNotificationsTab } from "./tabs/worker-notifications-tab"
import { WorkerSecurityTab } from "./tabs/worker-security-tab"

interface WorkerUserProps {
  id: string
  name: string
  email: string
  phone: string
  category: string
  skills: string[]
  initials: string
  avatarUrl?: string | null
}

export function WorkerSettingsClient({ user }: { user: WorkerUserProps }) {
  const t = useTranslations("WorkerSettings")
  const [activeTab, setActiveTab] = useState<any>("profile")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl || null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      const filePath = `avatar-worker-${user.id}-${Date.now()}.${ext}`

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

  const tabs: TabItem[] = [
    { id: "profile" as any, label: t("tabProfile"), icon: User },
    { id: "rules" as any, label: t("tabSkills"), icon: Code2 },
    { id: "notifications" as any, label: t("tabNotifications"), icon: Bell },
    { id: "security" as any, label: t("tabSecurity"), icon: Key },
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

      {/* Header Banner - Matches Admin layout with Worker Role Badge */}
      <SettingsHeaderBanner
        name={user.name}
        email={user.email}
        initials={user.initials}
        avatarUrl={avatarUrl}
        isUploadingAvatar={isUploadingAvatar}
        onUploadClick={() => fileInputRef.current?.click()}
        uploadLabel={t("uploadImage")}
        roleBadgeLabel={t("roleBadge")}
      />

      {/* Main Settings Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden flex flex-col md:flex-row">
        <SettingsTabNav
          tabs={tabs}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        <div className="flex-1 p-6 md:p-8">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <WorkerProfileTab
                user={user}
                avatarUrl={avatarUrl}
                setAvatarUrl={setAvatarUrl}
                isUploadingAvatar={isUploadingAvatar}
                fileInputRef={fileInputRef}
              />
            )}
            {activeTab === "rules" && (
              <WorkerSkillsTab initialSkills={user.skills} />
            )}
            {activeTab === "notifications" && (
              <WorkerNotificationsTab />
            )}
            {activeTab === "security" && (
              <WorkerSecurityTab />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
