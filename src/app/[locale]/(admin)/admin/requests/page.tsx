import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminRequestsClient, JobRequestItem, WorkerOption } from '@/components/admin/requests/admin-requests-client'
import { getTranslations } from 'next-intl/server'

export default async function AdminRequestsPage() {
  await requireRole(["ADMIN"])
  const t = await getTranslations('AdminRequests')

  // Fetch real projects with status REQUESTED / WORKER_REVIEW / PENDING_DP
  const dbProjects = await prisma.project.findMany({
    where: { 
      status: { in: ['REQUESTED', 'WORKER_REVIEW', 'PENDING_DP'] } 
    },
    include: { client: true, worker: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  // Fetch real team workers for assignment
  const dbWorkers = await prisma.user.findMany({
    where: { role: 'TEAM_MEMBER' },
    include: { tasks: { where: { status: { not: 'DONE' } } } },
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  const teamWorkers: WorkerOption[] = dbWorkers.map(w => ({
    id: w.id,
    name: w.name || 'Unnamed Worker',
    email: w.email,
    skills: w.skills || [],
    role: w.category || 'Developer',
    activeTasks: w.tasks?.length || 0
  }))

  // Map DB data
  const initialRequests: JobRequestItem[] = dbProjects.map((p) => ({
    id: p.id ? (p.id.includes('-') ? p.id.split('-')[0].toUpperCase() : p.id.substring(0, 8).toUpperCase()) : 'REQ',
    projectId: p.id,

    clientName: p.client?.name || 'Client',
    clientEmail: p.client?.email || 'client@crave.com',
    service: p.title,
    category: p.category || 'IT Development',
    budget: p.budgetRange || 'Rp 5.000.000 - Rp 10.000.000',
    status: p.status === 'REQUESTED' ? 'Pending Review' : p.status === 'WORKER_REVIEW' ? 'Worker Review' : 'Pending DP',
    date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Today',
    briefUrl: p.briefFileUrl,
    description: p.description,
    assignedWorker: p.worker?.name || null
  }))


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t('subtitle')}</p>
      </div>

      <AdminRequestsClient initialRequests={initialRequests} teamWorkers={teamWorkers} />
    </div>
  )
}

