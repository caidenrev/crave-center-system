import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { ClientProjectTracker } from '@/components/client/projects/client-project-tracker'
import { createClient } from "@/utils/supabase/server"

export default async function ClientProjectsPage() {
  const t = await getTranslations('ClientProjects')
  
  await requireRole(["CLIENT"])
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const dbUser = user?.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null
  
  let projects: any[] = []

  if (dbUser) {
    projects = await prisma.project.findMany({
      where: { clientId: dbUser.id },
      include: { worker: true, tasks: true },
      orderBy: { createdAt: 'desc' }
    })
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
        <ClientProjectTracker
          projects={projects.map(p => ({
            ...p,
            offeredPrice: p.offeredPrice ? p.offeredPrice.toString() : null
          }))}
          currentUserId={dbUser?.id || ""}
        />
      </div>
    </div>
  )
}
