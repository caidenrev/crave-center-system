import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { createClient } from "@/utils/supabase/server"
import { SettingsForm } from '@/components/client/settings-form'

export default async function ClientSettingsPage() {
  const t = await getTranslations('ClientSettings')
  
  await requireRole(["CLIENT"])
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const dbUser = user?.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null
  
  if (!dbUser) {
    return <div>User not found</div>
  }
  
  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('subtitle')}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <SettingsForm 
          user={dbUser} 
          t={{
            name: t('name'),
            phone: t('phone'),
            save: t('save'),
            saving: t('saving'),
            success: t('success'),
            error: t('error')
          }} 
        />
      </div>
    </div>
  )
}
