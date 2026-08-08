'use client'

import { useState } from 'react'
import {
  PlayCircle,
  CheckCircle,
  Clock,
  User,
  FolderKanban,
  MessageSquare,
  AlertCircle,
  CircleDashed,
  FileText,
  ChevronRight,
  LayoutGrid,
  List,
  ShieldCheck,
  Star,
  Loader2,
  Download,
  X,
  XCircle
} from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { approveProjectQuote, cancelProjectByClient } from '@/app/actions/client'
import { ProjectChatDrawer } from '@/components/chat/project-chat/project-chat-drawer'
import { WorkerRatingModal } from './worker-rating-modal'
import { ConfirmModal } from '@/components/ui/confirm-modal'

export interface ClientProjectCardItem {
  id: string
  title: string
  description?: string | null
  briefFileUrl?: string | null
  status: string
  targetDeliveryDate: string
  createdAt?: string
  worker?: { name: string; email?: string } | null
  offeredPrice?: string | null
  offeredDuration?: number | null
  clientRating?: number | null
  clientFeedback?: string | null
  progress?: number
  tasks?: { id: string; status: string }[]
}

interface ClientProjectTrackerProps {
  projects: ClientProjectCardItem[]
  currentUserId?: string
}

export function ClientProjectTracker({ projects, currentUserId }: ClientProjectTrackerProps) {
  const router = useRouter()
  const [chatProject, setChatProject] = useState<ClientProjectCardItem | null>(null)
  const [ratingProject, setRatingProject] = useState<ClientProjectCardItem | null>(null)
  const [selectedDetailProject, setSelectedDetailProject] = useState<ClientProjectCardItem | null>(null)
  const [cancelProjectId, setCancelProjectId] = useState<string | null>(null)
  const [isCanceling, setIsCanceling] = useState(false)
  const [isApproving, setIsApproving] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const t = useTranslations('ClientProjects')
  const tRating = useTranslations('WorkerRating')
  const locale = useLocale()

  const handleCancelProject = async () => {
    if (!cancelProjectId) return
    setIsCanceling(true)
    try {
      const res = await cancelProjectByClient(cancelProjectId)
      if (res.success) {
        toast.success(t('cancelSuccess') || 'Proyek berhasil dibatalkan.')
        setSelectedDetailProject(null)
        router.refresh()
      } else {
        toast.error(res.error || t('cancelError') || 'Gagal membatalkan proyek.')
      }
    } catch {
      toast.error(t('cancelError') || 'Terjadi kesalahan sistem.')
    } finally {
      setIsCanceling(false)
      setCancelProjectId(null)
    }
  }

  const handleApproveQuote = async (projectId: string) => {
    setIsApproving(projectId)
    try {
      const res = await approveProjectQuote(projectId)
      if (res.success) {
        toast.success(t('offerApproved') || 'Penawaran berhasil disetujui!')
        router.refresh()
      } else {
        toast.error(res.error || t('approveError') || 'Gagal menyetujui penawaran.')
      }
    } catch {
      toast.error(t('approveError') || 'Terjadi kesalahan sistem.')
    } finally {
      setIsApproving(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white shadow-sm border-none">
            <CircleDashed className="w-3.5 h-3.5" /> {t('statusRequested') || 'Requested'}
          </span>
        )
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm border-none">
            <PlayCircle className="w-3.5 h-3.5" /> {t('statusInProgress') || 'In Progress'}
          </span>
        )
      case 'WORKER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500 text-white shadow-sm border-none">
            <AlertCircle className="w-3.5 h-3.5" /> {t('statusOfferReceived') || 'Worker Review'}
          </span>
        )
      case 'PENDING_DP':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm border-none">
            <Clock className="w-3.5 h-3.5" /> {t('statusPendingDP') || 'Pending DP'}
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm border-none">
            <CheckCircle className="w-3.5 h-3.5" /> {t('statusCompleted') || 'Completed'}
          </span>
        )
      case 'IN_WARRANTY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-sm border-none">
            <ShieldCheck className="w-3.5 h-3.5" /> Garansi Aktif
          </span>
        )
      case 'ON_HOLD':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-sm border-none">
            <Clock className="w-3.5 h-3.5" /> {t('statusOnHold') || 'Delayed'}
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-sm border-none">
            <AlertCircle className="w-3.5 h-3.5" /> {t('statusCancelled') || 'Cancelled'}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-500 text-white shadow-sm border-none">
            <CircleDashed className="w-3.5 h-3.5" /> {status}
          </span>
        )
    }
  }

  // Calculate progress based on tasks or fallback to status default
  const getProgress = (proj: ClientProjectCardItem) => {
    if (typeof proj.progress === 'number') {
      return proj.progress
    }
    const totalTasks = proj.tasks?.length || 0
    const doneTasks = proj.tasks?.filter(t => t.status === 'DONE').length || 0
    if (totalTasks > 0) {
      return Math.round((doneTasks / totalTasks) * 100)
    }
    if (proj.status === 'COMPLETED' || proj.status === 'IN_WARRANTY') {
      return 100
    }
    return 0
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
        <FolderKanban className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 dark:text-slate-200">{t('noProjects') || 'No active projects'}</h3>
        <p className="text-xs text-slate-400 mt-1">Belum ada proyek aktif saat ini.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <div className="flex items-center bg-slate-50 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            suppressHydrationWarning
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-800 text-primary shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            suppressHydrationWarning
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-800 text-primary shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(proj => {
          const progress = getProgress(proj)
          return (
            <div 
              key={proj.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden"
            >
              <div>
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <span className="font-mono text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg md:rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 tracking-wider">
                    {proj.id.substring(0, 8)}
                  </span>
                  {getStatusBadge(proj.status)}
                </div>

                <div className="space-y-0.5 md:space-y-1 mb-3 md:mb-5">
                  <h3 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white leading-snug cursor-default line-clamp-2 min-h-[3.5rem]">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    Tanggal Pengajuan: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{proj.createdAt ? new Date(proj.createdAt).toLocaleDateString('id-ID') : new Date(proj.targetDeliveryDate).toLocaleDateString('id-ID')}</strong>
                  </p>
                </div>

                <div className="space-y-3 md:space-y-4 pt-3 md:pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <User className="w-3.5 h-3.5 text-primary" /> {t('workerLabel') || 'Worker'}
                    </span>
                    <span className="font-bold bg-blue-500 text-white px-3 py-1 rounded-full text-[11px] shadow-sm tracking-wider">
                      {proj.worker ? proj.worker.name : 'Unassigned'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-[10px] md:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completion</span>
                      <span className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5 md:mt-1 leading-none">{progress}%</span>
                    </div>
                    
                    <div className="relative w-[72px] h-[36px] flex items-end justify-center">
                      <svg className="w-full h-full drop-shadow-sm overflow-visible" viewBox="0 0 100 50">
                        <path
                          d="M 10 50 A 40 40 0 0 1 90 50"
                          fill="none"
                          className="stroke-slate-200 dark:stroke-slate-700"
                          strokeWidth="12"
                          strokeLinecap="round"
                        />
                        {progress > 0 && (
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            className={
                              progress === 100
                                ? 'stroke-emerald-500'
                                : proj.status === 'ON_HOLD'
                                ? 'stroke-amber-500'
                                : 'stroke-blue-500'
                            }
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${(progress / 100) * (Math.PI * 40)} ${Math.PI * 40}`}
                          />
                        )}
                      </svg>
                    </div>
                  </div>

                  {/* Worker Quote Offered Banner & Accept Action */}
                  {proj.offeredPrice != null && (
                    <div className="mt-3.5 p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-between gap-2 shadow-xs">
                      <div>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Penawaran Worker</span>
                        <strong className="text-xs md:text-sm font-black text-amber-800 dark:text-amber-200">
                          Rp {Number(proj.offeredPrice).toLocaleString('id-ID')}
                          {proj.offeredDuration ? ` (${proj.offeredDuration} hari)` : ''}
                        </strong>
                      </div>
                      {proj.status === 'WORKER_REVIEW' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApproveQuote(proj.id)
                          }}
                          disabled={isApproving === proj.id}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                        >
                          {isApproving === proj.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <span>{t('acceptOffer') || 'Terima Penawaran'}</span>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Elegant Action Panel */}
              <div className="pt-3 md:pt-4 mt-3 md:mt-4 space-y-2">
                <button
                  suppressHydrationWarning
                  disabled={proj.status === 'CANCELLED'}
                  onClick={() => proj.status !== 'CANCELLED' && setChatProject(proj)}
                  className={`w-full py-2 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    proj.status === 'CANCELLED'
                      ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-800'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer shadow-md'
                  }`}
                  title={proj.status === 'CANCELLED' ? "Ketentuan & Kontrak nonaktif untuk proyek yang dibatalkan" : "Ketentuan & Kontrak"}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span>Ketentuan & Kontrak</span>
                </button>

                {proj.status === 'COMPLETED' && (
                  <button
                    onClick={() => setRatingProject(proj)}
                    className="w-full py-2 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>{proj.clientRating ? tRating("yourRating", { rating: proj.clientRating }) : tRating("rateBtn")}</span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    suppressHydrationWarning
                    disabled={proj.status === 'CANCELLED'}
                    onClick={() => proj.status !== 'CANCELLED' && setChatProject(proj)}
                    className={`w-full py-2 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      proj.status === 'CANCELLED'
                        ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-800'
                        : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md'
                    }`}
                    title={proj.status === 'CANCELLED' ? "Pesan nonaktif untuk proyek yang dibatalkan" : undefined}
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('btnChat') || 'Pesan'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedDetailProject(proj)}
                    className="w-full py-2 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <span>Detail</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] pb-1">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 uppercase text-slate-500 dark:text-slate-400 font-bold text-xs border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Proyek</th>
                  <th className="px-6 py-4">Worker</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Penyelesaian</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {projects.map((proj) => {
                  const progress = getProgress(proj)
                  return (
                    <tr 
                      key={proj.id} 
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-xs text-slate-900 dark:text-slate-200">{proj.id.substring(0, 8)}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                        {proj.title}
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">{proj.createdAt ? new Date(proj.createdAt).toLocaleDateString('id-ID') : new Date(proj.targetDeliveryDate).toLocaleDateString('id-ID')}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold">{proj.worker ? proj.worker.name : 'Unassigned'}</td>
                      <td className="px-6 py-4">{getStatusBadge(proj.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center justify-center">
                          <div className="relative w-16 h-8 flex flex-col items-center justify-end">
                            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 50">
                              <path
                                d="M 10 50 A 40 40 0 0 1 90 50"
                                fill="none"
                                className="stroke-slate-200 dark:stroke-slate-700"
                                strokeWidth="12"
                                strokeLinecap="round"
                              />
                              {progress > 0 && (
                                <path
                                  d="M 10 50 A 40 40 0 0 1 90 50"
                                  fill="none"
                                  className={
                                    progress === 100
                                      ? 'stroke-emerald-500'
                                      : proj.status === 'ON_HOLD'
                                      ? 'stroke-amber-500'
                                      : 'stroke-blue-500'
                                  }
                                  strokeWidth="12"
                                  strokeLinecap="round"
                                  strokeDasharray={`${(progress / 100) * (Math.PI * 40)} ${Math.PI * 40}`}
                                />
                              )}
                            </svg>
                            <div className="flex flex-col items-center z-10 translate-y-1">
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white leading-none">{progress}%</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={proj.status === 'CANCELLED'}
                            onClick={() => proj.status !== 'CANCELLED' && setChatProject(proj)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                              proj.status === 'CANCELLED'
                                ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-800'
                                : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 cursor-pointer'
                            }`}
                            title={proj.status === 'CANCELLED' ? "Pesan nonaktif untuk proyek yang dibatalkan" : undefined}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Pesan</span>
                          </button>
                          <button
                            onClick={() => setSelectedDetailProject(proj)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rich Project Detail Modal */}
      {selectedDetailProject && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedDetailProject(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                  ID: {selectedDetailProject.id.substring(0, 8).toUpperCase()}
                </span>
                {getStatusBadge(selectedDetailProject.status)}
              </div>
              <button 
                onClick={() => setSelectedDetailProject(null)} 
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors rounded-full shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-5 flex-1">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-snug">
                  {selectedDetailProject.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <span>Tanggal Pengajuan: <strong className="text-slate-700 dark:text-slate-300">{selectedDetailProject.createdAt ? new Date(selectedDetailProject.createdAt).toLocaleDateString('id-ID') : new Date(selectedDetailProject.targetDeliveryDate).toLocaleDateString('id-ID')}</strong></span>
                </p>
              </div>

              {/* Meta Info Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Assigned Worker</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {selectedDetailProject.worker ? selectedDetailProject.worker.name : 'Unassigned'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Target Delivery</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {selectedDetailProject.targetDeliveryDate ? new Date(selectedDetailProject.targetDeliveryDate).toLocaleDateString('id-ID') : '-'}
                  </span>
                </div>
              </div>

              {/* Progress Section */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-slate-500">Penyelesaian Proyek</span>
                  <span className="text-slate-900 dark:text-white">{getProgress(selectedDetailProject)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500" 
                    style={{ width: `${getProgress(selectedDetailProject)}%` }} 
                  />
                </div>
              </div>

              {/* Brief Description */}
              {selectedDetailProject.description && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Brief / Deskripsi Proyek</h4>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedDetailProject.description.replace(/<[^>]*>?/gm, "").trim()}
                  </div>
                </div>
              )}

              {/* Brief File Download */}
              {selectedDetailProject.briefFileUrl && (
                <a
                  href={selectedDetailProject.briefFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-xs hover:bg-blue-100 transition-colors cursor-pointer w-fit border border-blue-200 dark:border-blue-900/50"
                >
                  <Download className="w-4 h-4" /> Download Lampiran Brief
                </a>
              )}

              {/* Offer Banner in Modal */}
              {selectedDetailProject.offeredPrice != null && (
                <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Penawaran Harga & Waktu Worker</span>
                    <strong className="text-sm font-black text-amber-800 dark:text-amber-200">
                      Rp {Number(selectedDetailProject.offeredPrice).toLocaleString('id-ID')}
                      {selectedDetailProject.offeredDuration ? ` (${selectedDetailProject.offeredDuration} hari)` : ''}
                    </strong>
                  </div>
                  {selectedDetailProject.status === 'WORKER_REVIEW' && (
                    <button
                      onClick={() => handleApproveQuote(selectedDetailProject.id)}
                      disabled={isApproving === selectedDetailProject.id}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {isApproving === selectedDetailProject.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span>{t('acceptOffer') || 'Terima Penawaran'}</span>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <button
                  disabled={selectedDetailProject.status === 'CANCELLED'}
                  onClick={() => {
                    const p = selectedDetailProject
                    setSelectedDetailProject(null)
                    setChatProject(p)
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Pesan
                </button>

                {['REQUESTED', 'WORKER_REVIEW', 'PENDING_DP'].includes(selectedDetailProject.status) && (
                  <button
                    onClick={() => setCancelProjectId(selectedDetailProject.id)}
                    className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-red-200 dark:border-red-900/50"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Batalkan
                  </button>
                )}
              </div>

              <button 
                onClick={() => setSelectedDetailProject(null)} 
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        open={Boolean(cancelProjectId)}
        onCancel={() => setCancelProjectId(null)}
        onConfirm={handleCancelProject}
        isLoading={isCanceling}
        title={t('confirmCancelTitle') || 'Batalkan Proyek?'}
        description={t('confirmCancelDesc') || 'Apakah Anda yakin ingin membatalkan pengajuan proyek ini? Tindakan ini tidak dapat dibatalkan.'}
        confirmText={t('btnCancel') || 'Batalkan Proyek'}
        variant="destructive"
      />

      {chatProject && (
        <ProjectChatDrawer
          isOpen={!!chatProject}
          onClose={() => setChatProject(null)}
          projectId={chatProject.id}
          projectTitle={chatProject.title}
          currentUserId={currentUserId || ""}
          userRole="CLIENT"
          isCancelled={chatProject.status === "CANCELLED"}
          isCompleted={chatProject.status === "COMPLETED"}
        />
      )}

      {ratingProject && (
        <WorkerRatingModal
          isOpen={!!ratingProject}
          onClose={() => setRatingProject(null)}
          projectId={ratingProject.id}
          projectTitle={ratingProject.title}
          workerName={ratingProject.worker?.name || "Worker"}
          existingRating={ratingProject.clientRating}
          existingFeedback={ratingProject.clientFeedback}
        />
      )}
    </div>
  )
}
