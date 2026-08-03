import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminProjectsClient, ProjectCardItem } from '@/components/admin/projects/admin-projects-client'
import { getTranslations } from 'next-intl/server'

export default async function AdminProjectsPage() {
  await requireRole(["ADMIN"])
  const t = await getTranslations('AdminProjects')

  // Fetch real projects from DB
  const dbProjects = await prisma.project.findMany({
    include: { client: true, worker: true, tasks: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  const initialProjects: ProjectCardItem[] = dbProjects.map((p) => {
    const totalTasks = p.tasks?.length || 0
    const doneTasks = p.tasks?.filter(t => t.status === 'DONE').length || 0
    const calculatedProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : (p.status === 'COMPLETED' ? 100 : 0)

    return {
      id: p.id.split('-')[0].toUpperCase(),
      name: p.title,
      client: p.client?.name || 'Client',
      manager: p.worker?.name || 'Unassigned Worker',
      status: p.status === 'IN_PROGRESS' ? 'In Progress' : p.status === 'COMPLETED' ? 'Completed' : 'Delayed',
      progress: calculatedProgress,
      dueDate: p.targetDeliveryDate ? new Date(p.targetDeliveryDate).toLocaleDateString() : 'TBD',
      description: p.description,
      budget: p.budgetRange || undefined
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold mb-2">
          {t('badge')}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t('subtitle')}</p>
      </div>

      <AdminProjectsClient initialProjects={initialProjects} />
    </div>
  )
}
