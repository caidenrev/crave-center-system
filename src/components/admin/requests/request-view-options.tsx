'use client'

import { useState } from 'react'
import { Settings2, ChevronDown, List, LayoutGrid, Download } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { JobRequestItem } from './admin-requests-client'

interface RequestViewOptionsProps {
  viewMode: 'table' | 'grid'
  setViewMode: (mode: 'table' | 'grid') => void
  orderBy: 'last_modified' | 'date_created'
  setOrderBy: (order: 'last_modified' | 'date_created') => void
  visibleProps: Record<string, boolean>
  toggleProperty: (key: string) => void
  filteredRequests: JobRequestItem[]
  showToast: (msg: string) => void
}

export function RequestViewOptions({
  viewMode,
  setViewMode,
  orderBy,
  setOrderBy,
  visibleProps,
  toggleProperty,
  filteredRequests,
  showToast,
}: RequestViewOptionsProps) {
  const [viewOptionsOpen, setViewOptionsOpen] = useState(false)
  const t = useTranslations('AdminRequests')

  const handleExportCSV = () => {
    const headers = ["ID", "Client Name", "Client Email", "Service", "Category", "Budget", "Status", "Assigned Worker"]
    const rows = filteredRequests.map(r => [
      `"${r.id}"`,
      `"${r.clientName}"`,
      `"${r.clientEmail}"`,
      `"${r.service}"`,
      `"${r.category}"`,
      `"${r.budget}"`,
      `"${r.status}"`,
      `"${r.assignedWorker || 'Unassigned'}"`
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `crave-job-requests-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast(t('exportCsv') + " Successful!")
  }

  return (
    <div className="relative">
      <button
        onClick={() => setViewOptionsOpen(!viewOptionsOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl shadow-xs transition-all cursor-pointer"
      >
        <Settings2 className="w-4 h-4 text-slate-500" /> {t('viewOptions')} <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {viewOptionsOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setViewOptionsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">{t('layout')}</span>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <button 
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('orderBy')}</label>
                <select 
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value as 'last_modified' | 'date_created')}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 outline-none font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="last_modified">{t('lastModified')}</option>
                  <option value="date_created">{t('dateCreated')}</option>
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('showProperties')}</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: 'reqId', label: 'ID' },
                    { key: 'clientInfo', label: 'Client' },
                    { key: 'service', label: 'Service' },
                    { key: 'budget', label: 'Budget' },
                    { key: 'status', label: 'Status' },
                    { key: 'worker', label: 'Worker' },
                  ].map(prop => (
                    <button
                      key={prop.key}
                      onClick={() => toggleProperty(prop.key)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
                        visibleProps[prop.key]
                          ? 'bg-primary/10 text-primary border-primary/20 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {prop.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
            
            <button 
              onClick={() => { setViewOptionsOpen(false); handleExportCSV(); }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-primary" /> {t('exportCsv')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
