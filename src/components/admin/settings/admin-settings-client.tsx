"use client"

import { useState, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import { User, Bell, Shield, Key } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"
import { updateUserAvatar } from "@/app/actions/client"
import { SettingsTabNav, TabType, TabItem } from "./settings-tab-nav"
import { ProfileTab } from "./tabs/profile-tab"
import { NotificationsTab } from "./tabs/notifications-tab"
import { RulesTab } from "./tabs/rules-tab"
import { SecurityTab } from "./tabs/security-tab"

interface AdminSettingsClientProps {
  user: {
    name: string
    email: string
    phone: string
    initials: string
    avatarUrl?: string | null
  }
}

export function AdminSettingsClient({ user }: AdminSettingsClientProps) {
  const t = useTranslations("AdminSettings")
  const [activeTab, setActiveTab] = useState<TabType>("profile")
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

      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })
      await updateUserAvatar(publicUrl)

      toast.success(t("avatarUploaded"))
    } catch {
      toast.error(t("avatarError"))
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const tabs: TabItem[] = [
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

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden flex flex-col md:flex-row">
        <SettingsTabNav
          tabs={tabs}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        <div className="flex-1 p-6 md:p-8">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <ProfileTab
                user={user}
                avatarUrl={avatarUrl}
                setAvatarUrl={setAvatarUrl}
                isUploadingAvatar={isUploadingAvatar}
                fileInputRef={fileInputRef}
              />
            )}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "rules" && <RulesTab />}
            {activeTab === "security" && <SecurityTab />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
