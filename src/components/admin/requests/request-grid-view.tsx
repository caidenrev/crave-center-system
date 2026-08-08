'use client'

import { Eye, UserPlus, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { JobRequestItem } from './admin-requests-client'

interface RequestGridViewProps {
  requests: JobRequestItem[]
  onViewBrief: (req: JobRequestItem) => void
  onAssignModal: (req: JobRequestItem) => void
  onRejectRequest: (id: string) => void
  getStatusBadge: (status: string) => React.ReactNode
}

export function RequestGridView({
  requests,
  onViewBrief,
  onAssignModal,
  onRejectRequest,
  getStatusBadge,
}: RequestGridViewProps) {
  const t = useTranslations('AdminRequests')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map(req => (
        <div key={req.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
                {req.id}
              </span>
              {getStatusBadge(req.status)}
            </div>
            
            <h4 className="font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-2 min-h-[3rem]">
              {req.service}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {req.category} • {t('budgetLabel')}: <span className="font-bold text-slate-700 dark:text-slate-200">{req.budget}</span>
            </p>
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{req.clientName}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium pl-5 truncate">{req.clientEmail}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onViewBrief(req)}
                className="flex-1 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Eye className="w-3.5 h-3.5 shrink-0" /> <span className="whitespace-nowrap">{t('btnViewBrief')}</span>
              </button>
              <button
                onClick={() => onAssignModal(req)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm ${req.assignedWorker ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
              >
                <UserPlus className="w-3.5 h-3.5 shrink-0" /> <span className="whitespace-nowrap">{req.assignedWorker ? t('btnReassignWorker') : t('btnAssignWorker')}</span>
              </button>
            </div>
            <button
              onClick={() => onRejectRequest(req.id)}
              className="w-full py-2 px-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
            >
              {t('reject')}
            </button>
          </div>


        </div>
      ))}
    </div>
  )
}
