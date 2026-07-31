import { prisma } from '@/lib/db'
import { createClient } from "@/utils/supabase/server"
import { ApplicationStatus, Role } from '@/generated/prisma'
import { ApplyWorkerForm } from '@/components/marketing/apply-worker-form'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function ApplyPage() {
  const t = await getTranslations('Apply')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl text-center border border-slate-200 dark:border-zinc-800">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t('loginReqTitle')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {t('loginReqDesc')}
          </p>
          <Link href="/login" className="block w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
            {t('loginBtn')}
          </Link>
        </div>
      </div>
    )
  }

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!dbUser) return <div>User not found in DB</div>

  if (dbUser.role === Role.TEAM_MEMBER || dbUser.role === Role.ADMIN) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl text-center border border-slate-200 dark:border-zinc-800">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t('alreadyWorkerTitle')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {t('alreadyWorkerDesc')}
          </p>
          <Link href="/" className="block w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-xl transition-colors">
            {t('dashboardBtn')}
          </Link>
        </div>
      </div>
    )
  }

  const existingApp = await prisma.workerApplication.findFirst({
    where: { userId: dbUser.id },
    orderBy: { createdAt: 'desc' }
  })

  if (existingApp && existingApp.status === ApplicationStatus.PENDING) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-slate-50 dark:bg-zinc-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl text-center border border-slate-200 dark:border-zinc-800">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t('underReviewTitle')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            {t('underReviewDesc')}
          </p>
          <Link href="/" className="block w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-xl transition-colors">
            {t('homeBtn')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">{t('pageTitle')}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('pageDesc')}
          </p>
        </div>

        {existingApp && existingApp.status === ApplicationStatus.REJECTED && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30">
            {t('rejectedMsg')}
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-slate-200 dark:border-zinc-800 p-6 md:p-10">
          <ApplyWorkerForm />
        </div>
      </div>
    </div>
  )
}
