import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { AdminRequestsClient, JobRequestItem } from '@/components/admin/admin-requests-client'
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

  // Map DB data or fallback to demo items if database has no active requests yet
  const initialRequests: JobRequestItem[] = dbProjects.length > 0 ? dbProjects.map((p) => ({
    id: p.id.split('-')[0].toUpperCase(),
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
  })) : [
    { id: 'REQ-101', clientName: 'Acme Corp', clientEmail: 'contact@acme.com', service: 'E-Commerce Website Revamp', category: 'Web App', budget: 'Rp 10.000.000 - 20.000.000', status: 'Pending Review', date: 'Oct 12, 2026', description: 'Complete overhaul of current e-commerce store with modern UI, mobile responsiveness, payment gateway integration, and fast performance.' },
    { id: 'REQ-102', clientName: 'TechFlow', clientEmail: 'hello@techflow.io', service: 'Mobile App (iOS/Android)', category: 'Mobile App', budget: 'Rp 25.000.000+', status: 'Worker Review', date: 'Oct 10, 2026', assignedWorker: 'Alex Johnson', description: 'Cross-platform mobile application built with React Native or Flutter, including user authentication and real-time push notifications.' },
    { id: 'REQ-103', clientName: 'Global Media', clientEmail: 'info@globalmedia.com', service: 'ITSM Dashboard Customization', category: 'Custom System', budget: 'Rp 5.000.000 - 10.000.000', status: 'Pending DP', date: 'Oct 09, 2026', description: 'Custom administrative reporting tools with data visualization and downloadable PDF invoices.' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
          {t('badge')}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t('subtitle')}</p>
      </div>

      <AdminRequestsClient initialRequests={initialRequests} />
    </div>
  )
}
