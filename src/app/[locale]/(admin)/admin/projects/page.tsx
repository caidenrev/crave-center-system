import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createClient } from '@/utils/supabase/server'
import { AdminProjectsClient, ProjectCardItem } from '@/components/admin/projects/admin-projects-client'
import { getTranslations } from 'next-intl/server'
import { autoDeleteCancelledProjects } from '@/app/actions/project'

export const dynamic = 'force-dynamic'

function calculateDaysRemaining(updatedAt: Date | string | null | undefined): number | undefined {
  if (!updatedAt) return undefined
  const now = Date.now()
  const daysElapsed = Math.floor((now - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, 28 - daysElapsed)
}

export default async function AdminProjectsPage() {
  await requireRole(["ADMIN"])
  const t = await getTranslations('AdminProjects')

  // Automatically prune cancelled projects older than 28 days
  await autoDeleteCancelledProjects().catch((err) => console.error("Auto-delete background run error:", err))

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const dbUser = user?.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null

  // Fetch real projects from DB
  const dbProjects = await prisma.project.findMany({
    include: { client: true, worker: true, tasks: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  const initialProjects: ProjectCardItem[] = dbProjects.map((p) => {
    const totalTasks = p.tasks?.length || 0
    const doneTasks = p.tasks?.filter(t => t.status === 'DONE').length || 0
    
    let calculatedProgress = 0
    if (totalTasks > 0) {
      calculatedProgress = Math.round((doneTasks / totalTasks) * 100)
    } else {
      switch (p.status) {
        case 'REQUESTED': calculatedProgress = 10; break;
        case 'WORKER_REVIEW': calculatedProgress = 25; break;
        case 'PENDING_DP': calculatedProgress = 40; break;
        case 'IN_PROGRESS': calculatedProgress = 65; break;
        case 'ON_HOLD': calculatedProgress = 65; break;
        case 'COMPLETED': calculatedProgress = 100; break;
        case 'CANCELLED': calculatedProgress = 0; break;
        case 'IN_WARRANTY': calculatedProgress = 100; break;
        default: calculatedProgress = 0; break;
      }
    }

    // Calculate remaining days for 28-day auto deletion if CANCELLED
    let daysRemaining: number | undefined = undefined
    if (p.status === 'CANCELLED' && p.updatedAt) {
      daysRemaining = calculateDaysRemaining(p.updatedAt)
    }

    return {
      id: p.id ? (p.id.includes('-') ? p.id.split('-')[0].toUpperCase() : p.id.substring(0, 8).toUpperCase()) : 'PROJ',
      fullProjectId: p.id,
      name: p.title,
      client: p.client?.name || 'Client',
      manager: p.worker?.name || 'Unassigned Worker',
      status: p.status,
      progress: calculatedProgress,
      dueDate: p.targetDeliveryDate ? new Date(p.targetDeliveryDate).toLocaleDateString() : 'TBD',
      description: p.description,
      budget: p.budgetRange || undefined,
      updatedAt: p.updatedAt ? p.updatedAt.toISOString() : undefined,
      daysRemaining,
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t('subtitle')}</p>
      </div>

      <AdminProjectsClient initialProjects={initialProjects} currentUserId={dbUser?.id || ""} />
    </div>
  )
}

