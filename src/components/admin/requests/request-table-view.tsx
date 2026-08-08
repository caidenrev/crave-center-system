'use client'

import { Eye, UserPlus, Briefcase} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { JobRequestItem } from './admin-requests-client'

interface RequestTableViewProps {
  requests: JobRequestItem[]
  visibleProps: Record<string, boolean>
  openActionId: string | null
  setOpenActionId: (id: string | null) => void
  onViewBrief: (req: JobRequestItem) => void
  onAssignModal: (req: JobRequestItem) => void
  onRejectRequest: (id: string) => void
  getStatusBadge: (status: string) => React.ReactNode
}

export function RequestTableView({
  requests,
  visibleProps,
  onViewBrief,
  onAssignModal,
  onRejectRequest,
  getStatusBadge,
}: RequestTableViewProps) {
  const t = useTranslations('AdminRequests')

  if (requests.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
        <Briefcase className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
        <p className="font-bold text-sm">{t('noResults')}</p>
        <p className="text-xs mt-1 text-slate-400">{t('noResultsDesc')}</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs">
      <div className="overflow-x-auto rounded-3xl">
        <div className="min-w-[800px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {visibleProps.reqId && <th className="py-4 px-6 whitespace-nowrap">{t('thReqId')}</th>}
              {visibleProps.clientInfo && <th className="py-4 px-6 whitespace-nowrap">{t('thClientInfo')}</th>}
              {visibleProps.service && <th className="py-4 px-6 whitespace-nowrap">{t('thService')}</th>}
              {visibleProps.budget && <th className="py-4 px-6 whitespace-nowrap">{t('thBudget')}</th>}
              {visibleProps.status && <th className="py-4 px-6 whitespace-nowrap">{t('thStatus')}</th>}
              {visibleProps.worker && <th className="py-4 px-6 whitespace-nowrap">{t('thWorker')}</th>}
              <th className="py-4 px-6 text-right whitespace-nowrap">{t('thActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {requests.map((req) => (
              <tr 
                key={req.id} 
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
              >
                {visibleProps.reqId && (
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                      {req.id}
                    </span>
                  </td>
                )}
                {visibleProps.clientInfo && (
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{req.clientName}</div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">{req.clientEmail}</div>
                    </div>
                  </td>
                )}
                {visibleProps.service && (
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{req.service}</div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">{req.category}</div>
                    </div>
                  </td>
                )}
                {visibleProps.budget && (
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {req.budget}
                  </td>
                )}
                {visibleProps.status && (
                  <td className="py-4 px-6 whitespace-nowrap">
                    {getStatusBadge(req.status)}
                  </td>
                )}
                {visibleProps.worker && (
                  <td className="py-4 px-6 whitespace-nowrap">
                    {req.assignedWorker ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-[10px]">
                          {req.assignedWorker.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{req.assignedWorker}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">{t('unassigned')}</span>
                    )}
                  </td>
                )}
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewBrief(req)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{t('btnViewBrief')}</span>
                    </button>
                    <button
                      onClick={() => onAssignModal(req)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs ${req.assignedWorker ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                      <UserPlus className="w-3.5 h-3.5 shrink-0" />
                      <span>{req.assignedWorker ? t('btnReassignWorker') : t('btnAssignWorker')}</span>
                    </button>
                    <button
                      onClick={() => onRejectRequest(req.id)}
                      title={t('reject')}
                      className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {t('reject')}
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>

  )
}
