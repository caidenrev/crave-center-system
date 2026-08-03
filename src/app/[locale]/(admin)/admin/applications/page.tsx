import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { ApplicationStatus } from '@/generated/prisma'
import { AdminApplicationsClient, ApplicationItem } from '@/components/admin/applications/admin-applications-client'
import { getTranslations } from 'next-intl/server'

export default async function AdminApplicationsPage() {
  await requireRole(["ADMIN"])
  const t = await getTranslations('AdminApplications')

  const pendingApps = await prisma.workerApplication.findMany({
    where: { status: ApplicationStatus.PENDING },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  })

  const applications: ApplicationItem[] = pendingApps.map((app: any) => ({
    id: app.id,
    userName: app.user.name,
    userEmail: app.user.email,
    category: app.category,
    skills: app.skills,
    portfolioUrl: app.portfolioUrl,
    githubUrl: app.githubUrl,
    linkedinUrl: app.linkedinUrl,
    instagramUrl: app.instagramUrl,
    tiktokUrl: app.tiktokUrl,
    reason: app.reason,
    whatsapp: app.whatsapp,
    email: app.email,
    createdAt: app.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{t('title')}</h1>
        <p className="text-slate-500 dark:text-slate-400">{t('subtitle')}</p>
      </div>

      <AdminApplicationsClient applications={applications} />
    </div>
  )
}
