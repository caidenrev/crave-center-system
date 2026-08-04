import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createClient } from '@/utils/supabase/server'
import { getTranslations } from 'next-intl/server'
import { WorkerSettingsClient } from '@/components/worker/settings/worker-settings-client'

export default async function WorkerSettingsPage() {
  await requireRole(["TEAM_MEMBER"])
  const t = await getTranslations("WorkerSettings")
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user?.email) return null

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!dbUser) return null

  const email = dbUser.email
  const name = dbUser.name || user.user_metadata?.full_name || "Crave Worker"
  const phone = dbUser.phone || ""
  const category = dbUser.category || "IT"
  const skills = dbUser.skills || []
  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t("pageTitle")}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t("pageSubtitle")}</p>
      </div>

      <WorkerSettingsClient
        user={{
          id: dbUser.id,
          name,
          email,
          phone,
          category,
          skills,
          initials,
          avatarUrl,
        }}
      />
    </div>
  )
}


