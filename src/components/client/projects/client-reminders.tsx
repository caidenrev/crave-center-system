'use client'

import { AlertCircle, Clock, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { ClientProjectCardItem } from './client-project-tracker'

interface ClientRemindersProps {
  projects: ClientProjectCardItem[]
}

export function ClientReminders({ projects }: ClientRemindersProps) {
  const t = useTranslations('ClientProjects')
  const locale = useLocale()

  const pendingApprovals = projects.filter(p => p.status === 'WORKER_REVIEW')
  const pendingPayments = projects.filter(p => p.status === 'PENDING_DP')

  const hasReminders = pendingApprovals.length > 0 || pendingPayments.length > 0

  if (!hasReminders) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-center items-center text-center h-full min-h-[250px]">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">You're all set!</h3>
        <p className="text-sm text-slate-500">There are no pending actions or reminders at the moment.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col">
      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-amber-500" /> Action Required
      </h3>
      
      <div className="space-y-4 flex-1">
        {pendingApprovals.map(proj => (
          <div key={`appr-${proj.id}`} className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex flex-col gap-3">
            <div>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-1">Worker Review</p>
              <h4 className="font-semibold text-slate-900 dark:text-white leading-tight">{proj.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Review offer from <strong className="text-slate-800 dark:text-slate-200">{proj.worker?.name}</strong>.</p>
            </div>
            <Link 
              href={`/${locale}/client/projects`}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              Review Offer <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}

        {pendingPayments.map(proj => (
          <div key={`pay-${proj.id}`} className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl flex flex-col gap-3">
            <div>
              <p className="text-xs font-bold text-purple-600 dark:text-purple-500 uppercase tracking-wider mb-1">Pending Payment</p>
              <h4 className="font-semibold text-slate-900 dark:text-white leading-tight">{proj.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Down payment required to start project.</p>
            </div>
            <Link 
              href={`/${locale}/client/billing`}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              Pay Now <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
