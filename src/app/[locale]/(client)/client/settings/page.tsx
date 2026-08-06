import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createClient } from "@/utils/supabase/server"
import { getTranslations } from 'next-intl/server'
import { ClientSettingsClient } from '@/components/client/settings/client-settings-client'

export default async function ClientSettingsPage() {
  await requireRole(["CLIENT"])
  const t = await getTranslations('ClientSettings')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user?.email) return null

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })
  
  if (!dbUser) {
    return <div className="p-8 text-slate-500">Pengguna tidak ditemukan</div>
  }

  const avatarUrl = dbUser.image || user.user_metadata?.avatar_url || user.user_metadata?.picture || null
  const initials = (dbUser.name || "CL").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  const clientUser = {
    id: dbUser.id,
    name: dbUser.name || "Client",
    email: dbUser.email,
    phone: dbUser.phone || "",
    initials,
    avatarUrl,
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t('subtitle')}</p>
      </div>

      <ClientSettingsClient user={clientUser} />
    </div>
  )
}
