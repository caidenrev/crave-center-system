'use client'

import { useState } from 'react'
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  UserPlus,
  Search,
  Filter,
  X,
  UserCheck,
  Briefcase,
  User,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

export interface JobRequestItem {
  id: string
  clientName: string
  clientEmail: string
  service: string
  category: string
  budget: string
  status: string
  date: string
  briefUrl?: string | null
  description?: string
  assignedWorker?: string | null
}

export interface WorkerOption {
  id: string
  name: string
  email: string
  skills: string[]
  role: string
  activeTasks: number
}

const mockWorkersList: WorkerOption[] = [
  { id: 'w1', name: 'Alex Johnson', email: 'alex@crave.com', skills: ['Next.js', 'React', 'Tailwind'], role: 'Frontend Specialist', activeTasks: 2 },
  { id: 'w2', name: 'Devon Carter', email: 'devon@crave.com', skills: ['Node.js', 'PostgreSQL', 'Prisma'], role: 'Backend Engineer', activeTasks: 4 },
  { id: 'w3', name: 'Siti Rahma', email: 'siti@crave.com', skills: ['Figma', 'UI/UX', 'Prototyping'], role: 'Product Designer', activeTasks: 1 },
  { id: 'w4', name: 'Michael Chen', email: 'michael@crave.com', skills: ['Flutter', 'iOS', 'Android'], role: 'Mobile Developer', activeTasks: 0 },
]

export function AdminRequestsClient({ initialRequests }: { initialRequests: JobRequestItem[] }) {
  const [requests, setRequests] = useState<JobRequestItem[]>(initialRequests)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const t = useTranslations('AdminRequests')
  
  // Modals state
  const [selectedRequest, setSelectedRequest] = useState<JobRequestItem | null>(null)
  const [assigningRequest, setAssigningRequest] = useState<JobRequestItem | null>(null)
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.service.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'ALL' || req.status.toLowerCase().replace(/\s+/g, '_') === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pending Review':
      case 'REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            {t('filterPending')}
          </span>
        )
      case 'Awaiting Assignment':
      case 'WORKER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> {t('filterWorker')}
          </span>
        )
      case 'Needs Clarification':
      case 'PENDING_DP':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> {t('filterPendingDP')}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            {status}
          </span>
        )
    }
  }

  const handleAssignWorker = () => {
    if (!assigningRequest || !selectedWorkerId) return
    const worker = mockWorkersList.find(w => w.id === selectedWorkerId)
    if (!worker) return

    setRequests(prev => prev.map(r => 
      r.id === assigningRequest.id ? { ...r, assignedWorker: worker.name, status: 'WORKER_REVIEW' } : r
    ))

    showToast(`${t('confirmAssign')}: ${worker.name}`)
    setAssigningRequest(null)
    setSelectedWorkerId(null)
  }

  return (
    <div className="space-y-6">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Control Bar: Search & Filter */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {[
            { id: 'ALL', label: t('filterAll') },
            { id: 'PENDING_REVIEW', label: t('filterPending') },
            { id: 'WORKER_REVIEW', label: t('filterWorker') },
            { id: 'PENDING_DP', label: t('filterPendingDP') },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setStatusFilter(filter.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === filter.id
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">{t('filterAll')}</h4>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">{t('thReqId')}</th>
                  <th className="px-6 py-4">{t('thClientInfo')}</th>
                  <th className="px-6 py-4">{t('thService')}</th>
                  <th className="px-6 py-4">{t('thBudget')}</th>
                  <th className="px-6 py-4">{t('thStatus')}</th>
                  <th className="px-6 py-4">{t('thWorker')}</th>
                  <th className="px-6 py-4 text-right">{t('thActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                    {/* ID */}
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                        {req.id}
                      </span>
                    </td>

                    {/* Client */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-primary via-indigo-500 to-purple-600 p-0.5 shadow-xs shrink-0">
                          <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white font-extrabold text-xs">
                            {req.clientName.charAt(0)}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{req.clientName}</div>
                          <div className="text-[11px] text-slate-400 font-mono truncate">{req.clientEmail}</div>
                        </div>
                      </div>
                    </td>

                    {/* Service & Category */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{req.service}</div>
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        <Briefcase className="w-3 h-3 text-slate-400" /> {req.category}
                      </span>
                    </td>

                    {/* Budget */}
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-sm">
                      {req.budget}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">{getStatusBadge(req.status)}</td>

                    {/* Worker */}
                    <td className="px-6 py-4">
                      {req.assignedWorker ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                          <UserCheck className="w-3.5 h-3.5" /> {req.assignedWorker}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> {t('unassigned')}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-primary" /> {t('viewBrief')}
                        </button>
                        <button
                          onClick={() => setAssigningRequest(req)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" /> {t('assign')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Brief Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
            <button 
              onClick={() => setSelectedRequest(null)} 
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20">
                {selectedRequest.id}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3">{selectedRequest.service}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('requestedBy')} {selectedRequest.clientName} ({selectedRequest.clientEmail})</p>
            </div>

            <div className="space-y-4 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">{t('estimatedBudget')}</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedRequest.budget}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">{t('category')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedRequest.category}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block mb-1">{t('briefDesc')}</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  {selectedRequest.description || "Client uploaded a project brief detailing requirements for UI/UX design, Next.js frontend implementation, and backend integration."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Worker Modal */}
      {assigningRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative space-y-5">
            <button 
              onClick={() => setAssigningRequest(null)} 
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('assignModalTitle')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('assignModalSubtitle')} <strong className="text-slate-900 dark:text-white">{assigningRequest.id} - {assigningRequest.service}</strong></p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {mockWorkersList.map(worker => (
                <div
                  key={worker.id}
                  onClick={() => setSelectedWorkerId(worker.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedWorkerId === worker.id
                      ? 'bg-primary/10 border-primary text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                      {worker.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{worker.name}</div>
                      <div className="text-[10px] text-slate-400">{worker.role} • {t('activeTasks')}: {worker.activeTasks}</div>
                    </div>
                  </div>
                  {selectedWorkerId === worker.id && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setAssigningRequest(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleAssignWorker}
                disabled={!selectedWorkerId}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/25 disabled:opacity-50 cursor-pointer"
              >
                {t('confirmAssign')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
