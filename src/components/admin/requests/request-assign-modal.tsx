'use client'

import { X, UserPlus, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { JobRequestItem, WorkerOption } from './admin-requests-client'

interface RequestAssignModalProps {
  assigningRequest: JobRequestItem | null
  workersList: WorkerOption[]
  selectedWorkerId: string | null
  setSelectedWorkerId: (id: string | null) => void
  onClose: () => void
  onAssign: () => void
  isLoading?: boolean
}

export function RequestAssignModal({
  assigningRequest,
  workersList,
  selectedWorkerId,
  setSelectedWorkerId,
  onClose,
  onAssign,
  isLoading = false,
}: RequestAssignModalProps) {
  const t = useTranslations('AdminRequests')

  if (!assigningRequest) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-[28px] max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('assignModalTitle')}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {assigningRequest.id} • {assigningRequest.service}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {workersList.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 font-medium">
              {t('noWorkersAvailable')}
            </div>
          ) : (
            workersList.map(worker => (
              <div
                key={worker.id}
                onClick={() => !isLoading && setSelectedWorkerId(worker.id)}
                className={`p-4 rounded-[20px] border transition-all cursor-pointer flex items-center gap-4 ${
                  selectedWorkerId === worker.id
                    ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-[#fafafa] dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                } ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
              >
                <div className="w-10 h-10 shrink-0 rounded-[12px] bg-[#dbeafe] dark:bg-blue-900/50 text-[#2563eb] dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                  {worker.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-900 dark:text-white truncate">{worker.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{worker.role} • {t('activeTasks')}: {worker.activeTasks}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {t('cancelBtn')}
          </button>
          <button
            onClick={onAssign}
            disabled={!selectedWorkerId || isLoading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {t('processing')}
              </>
            ) : (
              t('confirmAssign')
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
