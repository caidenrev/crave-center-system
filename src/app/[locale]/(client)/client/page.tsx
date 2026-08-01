import { ArrowUpRight, Clock, CheckCircle2, CircleDashed } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { ClientProjectList } from '@/components/client/client-project-list'

import { createClient } from "@/utils/supabase/server"

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
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-2xl transition-all shadow-lg shadow-primary/30 flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <span className="text-xl leading-none">+</span> {t('addProject')}
          </Link>
        </div>
      </div>

      {/* Stats Grid - Modern Vibrant Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
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

      {/* Second Row Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project List (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">{t('recentProjects')}</h3>
            <Link href={`/${locale}/client/projects`} className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">{t('viewAll')}</Link>
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <ClientProjectList projects={filteredProjects.map(p => ({
              ...p,
              offeredPrice: p.offeredPrice ? p.offeredPrice.toString() : null
            }))} t={{}} />
          </div>
        </div>

        {/* Project Progress/Reminders (1 column) */}
        <div className="flex flex-col gap-6">
          {/* Reminder Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">{t('reminders')}</h3>
            {upcomingProject ? (
              <>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2">Deadline: {upcomingProject.title}</h4>
                <div className="flex items-center gap-2 mt-3 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-xl w-fit">
                  <Clock className="w-4 h-4" /> {t('dueDate')} {new Date(upcomingProject.targetDeliveryDate).toLocaleDateString()}
                </div>
                <Link href={`/${locale}/client/projects`} className="w-full mt-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md flex justify-center items-center">
                  View Project
                </Link>
              </>
            ) : (
              <div className="text-slate-500 dark:text-slate-400 mt-4">
                No upcoming deadlines.
              </div>
            )}
          </div>

          {/* Mini Progress Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex-1 flex flex-col justify-center items-center relative overflow-hidden shadow-sm">
             <h3 className="font-bold text-lg text-slate-900 dark:text-white absolute top-6 left-6">{t('progress')}</h3>
             <div className="w-36 h-36 rounded-full border-[10px] border-primary/20 flex items-center justify-center mt-10 shadow-inner">
                <div className="text-center">
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{progressPercentage}%</span>
                </div>
             </div>
             <div className="flex justify-center gap-5 mt-8 w-full text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div> {t('completed')}</div>
               <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></div> {t('inProgress')}</div>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
