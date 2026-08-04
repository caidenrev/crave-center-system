'use client'

import { X, Briefcase, Eye } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { JobRequestItem } from './admin-requests-client'

interface RequestBriefModalProps {
  selectedRequest: JobRequestItem | null
  onClose: () => void
  getStatusBadge: (status: string) => React.ReactNode
}

export function RequestBriefModal({
  selectedRequest,
  onClose,
  getStatusBadge,
}: RequestBriefModalProps) {
  const t = useTranslations('AdminRequests')

  if (!selectedRequest) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-[28px] max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-md">
              {selectedRequest.id}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {selectedRequest.service}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('clientLabel')}</span>
              <p className="font-bold text-slate-900 dark:text-white truncate mt-0.5">{selectedRequest.clientName}</p>
              <p className="text-[11px] text-slate-500 truncate">{selectedRequest.clientEmail}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('budgetLabel')}</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedRequest.budget}</p>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('thCategory')} & Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                {selectedRequest.category}
              </span>
              {getStatusBadge(selectedRequest.status)}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('projectDescLabel')}</span>
            <p className="mt-1 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 leading-relaxed font-normal">
              {selectedRequest.description || t('noDescription')}
            </p>
          </div>

          {selectedRequest.briefUrl && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('attachedBriefLabel')}</span>
              <div className="mt-1">
                <a
                  href={selectedRequest.briefUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold hover:underline"
                >
                  <Briefcase className="w-4 h-4" /> {t('downloadBriefBtn')}
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            {t('close')}
          </button>
        </div>

      </div>
    </div>
  )
}
