import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createClient } from '@/utils/supabase/server'
import { getTranslations } from 'next-intl/server'
import { AdminSettingsClient } from '@/components/admin/settings/admin-settings-client'

export default async function WorkerSettingsPage() {
  await requireRole(["TEAM_MEMBER"])
  const t = await getTranslations('WorkerDashboard') // Or maybe create a new namespace for Settings if needed, but we can reuse AdminSettings or generic. Wait, the admin uses AdminSettings.
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let dbUser = null
  if (user) {
    dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  }

  const email = user?.email || "worker@crave.com"
  const name = dbUser?.name || user?.user_metadata?.full_name || "Crave Worker"
  const phone = dbUser?.phone || ""
  const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Pengaturan</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola profil dan preferensi akun Anda.</p>
      </div>

      <AdminSettingsClient user={{ name, email, phone, initials, avatarUrl }} />
    </div>
  )
}
