'use client'

import { useState, useTransition } from 'react'
import { Search, X, CheckCircle2, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { assignWorkerToRequest, rejectJobRequest } from '@/app/actions/project'
import { RequestViewOptions } from './request-view-options'
import { RequestTableView } from './request-table-view'
import { RequestGridView } from './request-grid-view'
import { RequestBriefModal } from './request-brief-modal'
import { RequestAssignModal } from './request-assign-modal'
import { ConfirmModal } from '@/components/ui/confirm-modal'


export interface JobRequestItem {
  id: string
  projectId: string
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

interface AdminRequestsClientProps {
  initialRequests: JobRequestItem[]
  teamWorkers?: WorkerOption[]
}

export function AdminRequestsClient({ initialRequests, teamWorkers = [] }: AdminRequestsClientProps) {
  const workersList = teamWorkers
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [requests, setRequests] = useState<JobRequestItem[]>(initialRequests)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [orderBy, setOrderBy] = useState<'last_modified' | 'date_created'>('last_modified')
  const [visibleProps, setVisibleProps] = useState<Record<string, boolean>>({
    reqId: true,
    clientInfo: true,
    service: true,
    budget: true,
    status: true,
    worker: true,
  })
  
  const t = useTranslations('AdminRequests')
  
  // Modals & Toast State
  const [selectedRequest, setSelectedRequest] = useState<JobRequestItem | null>(null)
  const [assigningRequest, setAssigningRequest] = useState<JobRequestItem | null>(null)
  const [rejectingRequestItem, setRejectingRequestItem] = useState<JobRequestItem | null>(null)
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [openActionId, setOpenActionId] = useState<string | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)
  const [isRejecting, setIsRejecting] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const toggleProperty = (key: string) => {
    setVisibleProps(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.service.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'ALL' || req.status.toLowerCase().replace(/\s+/g, '_') === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    if (orderBy === 'date_created') {
      return a.id.localeCompare(b.id)
    }
    return 0
  })

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pending Review':
      case 'REQUESTED':
        return (
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 whitespace-nowrap">
            {t('filterPending')}
          </span>
        )
      case 'Worker Review':
      case 'WORKER_REVIEW':
        return (
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 whitespace-nowrap">
            {t('filterWorker')}
          </span>
        )
      case 'Pending DP':
      case 'PENDING_DP':
        return (
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 whitespace-nowrap">
            {t('filterPendingDP')}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
            {status}
          </span>
        )
    }
  }

  const handleAssignWorker = async () => {
    if (!assigningRequest || !selectedWorkerId || isAssigning) return
    const workerObj = workersList.find(w => w.id === selectedWorkerId)
    if (!workerObj) return

    setIsAssigning(true)
    try {
      const result = await assignWorkerToRequest(assigningRequest.projectId, selectedWorkerId)
      
      if (result.success) {
        setRequests(prev => prev.map(req => {
          if (req.projectId === assigningRequest.projectId) {
            return {
              ...req,
              assignedWorker: workerObj.name,
              status: 'Worker Review'
            }
          }
          return req
        }))
        showToast(t('assignSuccess', { worker: workerObj.name, request: assigningRequest.service }))
        startTransition(() => router.refresh())
      } else {
        showToast(result.error || t('assignError'))
      }
    } catch {
      showToast(t('assignError'))
    } finally {
      setIsAssigning(false)
      setAssigningRequest(null)
      setSelectedWorkerId(null)
    }
  }

  const handleRejectClick = (id: string) => {
    const request = requests.find(r => r.id === id || r.projectId === id)
    if (request) {
      setRejectingRequestItem(request)
    }
  }

  const confirmRejectRequest = async () => {
    if (!rejectingRequestItem || isRejecting) return
    const id = rejectingRequestItem.id

    setIsRejecting(id)
    try {
      const result = await rejectJobRequest(rejectingRequestItem.projectId)
      
      if (result.success) {
        setRequests(prev => prev.filter(r => r.projectId !== rejectingRequestItem.projectId))
        showToast(t('rejectSuccess', { request: rejectingRequestItem.service }))
        startTransition(() => router.refresh())
      } else {
        showToast(result.error || t('rejectError'))
      }
    } catch {
      showToast(t('rejectError'))
    } finally {
      setIsRejecting(null)
      setRejectingRequestItem(null)
      setOpenActionId(null)
    }
  }


  return (
    <div className="space-y-6">
      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {(isAssigning || isRejecting || isPending) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[60] flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-2xl border border-slate-200 dark:border-slate-700">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('processing')}
            </span>
          </div>
        </div>
      )}

      {/* Toolbar: Search, Filters, View Options */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs relative z-20">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-xs outline-none focus:border-primary text-slate-800 dark:text-slate-200 font-medium transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters & View Options */}
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 text-xs overflow-x-auto max-w-full">
            {[
              { key: 'ALL', label: t('filterAll') },
              { key: 'PENDING_REVIEW', label: t('filterPending') },
              { key: 'WORKER_REVIEW', label: t('filterWorker') },
              { key: 'PENDING_DP', label: t('filterPendingDP') },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === f.key
                    ? 'bg-white dark:bg-slate-900 text-primary dark:text-white font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* View Options */}
          <RequestViewOptions
            viewMode={viewMode}
            setViewMode={setViewMode}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            visibleProps={visibleProps}
            toggleProperty={toggleProperty}
            filteredRequests={filteredRequests}
            showToast={showToast}
          />
        </div>
      </div>

      {/* Content Rendering: Table vs Grid View */}
      {viewMode === 'table' ? (
        <RequestTableView
          requests={filteredRequests}
          visibleProps={visibleProps}
          openActionId={openActionId}
          setOpenActionId={setOpenActionId}
          onViewBrief={(req) => setSelectedRequest(req)}
          onAssignModal={(req) => { setAssigningRequest(req); setSelectedWorkerId(null); }}
          onRejectRequest={handleRejectClick}
          getStatusBadge={getStatusBadge}
        />
      ) : (
        <RequestGridView
          requests={filteredRequests}
          onViewBrief={(req) => setSelectedRequest(req)}
          onAssignModal={(req) => { setAssigningRequest(req); setSelectedWorkerId(null); }}
          onRejectRequest={handleRejectClick}
          getStatusBadge={getStatusBadge}
        />
      )}

      {/* Brief Detail Modal */}
      <RequestBriefModal
        selectedRequest={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        getStatusBadge={getStatusBadge}
      />

      {/* Assign Worker Modal */}
      <RequestAssignModal
        assigningRequest={assigningRequest}
        workersList={workersList}
        selectedWorkerId={selectedWorkerId}
        setSelectedWorkerId={setSelectedWorkerId}
        onClose={() => setAssigningRequest(null)}
        onAssign={handleAssignWorker}
        isLoading={isAssigning}
      />

      {/* Reject Confirmation Modal */}
      <ConfirmModal
        open={!!rejectingRequestItem}
        onConfirm={confirmRejectRequest}
        onCancel={() => setRejectingRequestItem(null)}
        title={t('rejectConfirmTitle')}
        description={t('rejectConfirmDesc')}
        confirmText={t('reject')}
        cancelText={t('cancelBtn')}
        variant="destructive"
      />

    </div>
  )
}

