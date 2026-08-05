import { ArrowUpRight, Clock, CheckCircle2, CircleDashed, Banknote, CreditCard, Wallet } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { ClientProjectTracker } from '@/components/client/projects/client-project-tracker'
import { ClientReminders } from '@/components/client/projects/client-reminders'
import { ClientCalendar } from '@/components/client/projects/client-calendar'

import { createClient } from "@/utils/supabase/server"

export const dynamic = 'force-dynamic'

export default async function ClientDashboard({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ search?: string }> }) {
  const t = await getTranslations('ClientDashboard');
  const { locale } = await params;
  const { search } = await searchParams;
  
  await requireRole(["CLIENT"])
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const dbUser = user?.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null
  
  let projects: any[] = []
  let totalProjects = 0
  let pendingProjects = 0
  let runningProjects = 0
  let endedProjects = 0

  if (dbUser) {
    projects = await prisma.project.findMany({
      where: { clientId: dbUser.id },
      include: { worker: true },
      orderBy: { targetDeliveryDate: 'asc' }
    })
    
    totalProjects = projects.length
    pendingProjects = projects.filter(p => p.status === 'REQUESTED' || p.status === 'WORKER_REVIEW').length
    runningProjects = projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'PENDING_DP').length
    endedProjects = projects.filter(p => p.status === 'COMPLETED').length
  }

  // Filter projects by search query (title + status)
  const filteredProjects = search 
    ? projects.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.status.toLowerCase().includes(search.toLowerCase())
      )
    : projects;

  const progressPercentage = totalProjects > 0 ? Math.round((endedProjects / totalProjects) * 100) : 0;
  const activeProjects = projects.filter(p => p.status !== 'COMPLETED' && p.status !== 'CANCELLED');
  const upcomingProject = activeProjects.length > 0 
    ? activeProjects.sort((a, b) => new Date(a.targetDeliveryDate).getTime() - new Date(b.targetDeliveryDate).getTime())[0]
    : null;
  
  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href={`/${locale}/client/request/new`}
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-full transition-all shadow-lg shadow-primary/30 flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <span className="text-xl leading-none">+</span> {t('addProject')}
          </Link>
        </div>
      </div>

      {/* Stats Grid - Modern Vibrant Gradients */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Card 1 */}
        <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-xl shadow-blue-900/20 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-black/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-medium text-white/90">{t('totalProjects')}</span>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-5xl font-bold text-white mb-2">{totalProjects}</h3>
            <div className="flex items-center gap-2 text-xs font-medium text-white bg-white/20 backdrop-blur-md inline-flex px-3 py-1 rounded-lg">
              <span>Updated</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-linear-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-6 shadow-xl shadow-emerald-900/20 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-medium text-white/90">{t('endedProjects')}</span>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-5xl font-bold text-white mb-2">{endedProjects}</h3>
            <div className="flex items-center gap-2 text-xs font-medium text-white bg-white/20 backdrop-blur-md inline-flex px-3 py-1 rounded-lg">
              <span>Completed</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-linear-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 shadow-xl shadow-orange-900/20 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-medium text-white/90">{t('runningProjects')}</span>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <CircleDashed className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-5xl font-bold text-white mb-2">{runningProjects}</h3>
            <div className="flex items-center gap-2 text-xs font-medium text-white bg-white/20 backdrop-blur-md inline-flex px-3 py-1 rounded-lg">
              <span>In Progress</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-linear-to-br from-purple-500 to-pink-600 text-white rounded-3xl p-6 shadow-xl shadow-purple-900/20 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-medium text-white/90">{t('pendingProjects')}</span>
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-5xl font-bold text-white mb-2">{pendingProjects}</h3>
            <div className="flex items-center gap-2 text-xs font-medium text-white bg-white/20 backdrop-blur-md inline-flex px-3 py-1 rounded-lg">
              <span>{t('onDiscuss')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Second Row Grid: Project Tracker & Sidebar Widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Project Tracker (Takes up 2 columns on xl screens) */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2 px-2">
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">{t('recentProjects') || 'Active Projects Tracker'}</h3>
            <Link href={`/${locale}/client/projects`} className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              {t('viewAll') || 'View All'}
            </Link>
          </div>
          
          <ClientProjectTracker
            projects={filteredProjects.map(p => ({
              ...p,
              targetDeliveryDate: p.targetDeliveryDate.toISOString(),
              createdAt: p.createdAt.toISOString(),
              offeredPrice: p.offeredPrice ? p.offeredPrice.toString() : null
            }))}
            currentUserId={dbUser?.id || ""}
          />
        </div>

        {/* Sidebar Widgets (Calendar, Reminders & Progress) */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 xl:grid-cols-1 gap-4 md:gap-6">
            <ClientCalendar 
              projects={filteredProjects.map(p => ({
                id: p.id,
                title: p.title,
                status: p.status,
                createdAt: p.createdAt.toISOString(),
                targetDeliveryDate: p.targetDeliveryDate ? p.targetDeliveryDate.toISOString() : null
              }))}
            />
            
            <ClientReminders 
              projects={filteredProjects.map(p => ({
                ...p,
                targetDeliveryDate: p.targetDeliveryDate.toISOString(),
                createdAt: p.createdAt.toISOString(),
                offeredPrice: p.offeredPrice ? p.offeredPrice.toString() : null
              }))}
            />
          </div>

          {/* Transaction History Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex-1 flex flex-col relative shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg text-slate-900 dark:text-white">Riwayat Transaksi</h3>
               <Link href={`/${locale}/client/billing`} className="text-xs font-semibold text-primary hover:text-primary/80">Lihat Semua</Link>
             </div>
             
             <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {filteredProjects.length > 0 ? (
                  filteredProjects.slice(0, 4).map((proj, i) => (
                    <div key={`txn-${proj.id}`} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i % 2 === 0 ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'}`}>
                          {i % 2 === 0 ? <Banknote className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{proj.title || proj.name || 'Proyek'}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(proj.createdAt).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${i % 2 === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                          {i % 2 === 0 ? '+' : ''}Rp {(proj.offeredPrice || Math.floor(Math.random() * 5000000) + 1000000).toLocaleString('id-ID')}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{proj.status === 'COMPLETED' ? 'Berhasil' : 'Diproses'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
                    Belum ada riwayat transaksi
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
