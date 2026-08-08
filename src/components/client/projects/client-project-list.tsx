'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, CircleDashed, AlertCircle, Loader2, MessageSquare, Trash2, XCircle, LayoutList, LayoutGrid } from 'lucide-react'
import { approveProjectQuote, cancelProjectByClient, deleteProjectByClient } from '@/app/actions/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { toast } from 'sonner'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { ProjectChatDrawer } from '@/components/chat/project-chat/project-chat-drawer'

interface ClientProjectListProps {
  projects: any[]
  currentUserId?: string
}

export function ClientProjectList({ projects, currentUserId }: ClientProjectListProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('ClientProjects')
  const [isApproving, setIsApproving] = useState<string | null>(null)
  const [chatProject, setChatProject] = useState<any | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')

  const [modalConfig, setModalConfig] = useState<{
    open: boolean
    type: 'cancel' | 'delete' | null
    projectId: string | null
  }>({ open: false, type: null, projectId: null })

  async function handleApprove(projectId: string) {
    setIsApproving(projectId)
    try {
      const res = await approveProjectQuote(projectId)
      if (res.success) {
        toast.success(t('offerApproved'))
        router.refresh()
      } else {
        toast.error(res.error || t('approveError'))
      }
    } catch {
      toast.error(t('approveError'))
    } finally {
      setIsApproving(null)
    }
  }

  const [isCancelling, setIsCancelling] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  async function performCancel(projectId: string) {
    setIsCancelling(projectId)
    try {
      const res = await cancelProjectByClient(projectId)
      if (res.success) {
        toast.success(t('projectCancelled') || 'Proyek berhasil dibatalkan')
        router.refresh()
      } else {
        toast.error(res.error || t('cancelError') || 'Gagal membatalkan proyek')
      }
    } catch {
      toast.error(t('cancelError') || 'Gagal membatalkan proyek')
    } finally {
      setIsCancelling(null)
      setModalConfig({ open: false, type: null, projectId: null })
    }
  }

  async function performDelete(projectId: string) {
    setIsDeleting(projectId)
    try {
      const res = await deleteProjectByClient(projectId)
      if (res.success) {
        toast.success(t('projectDeleted') || 'Proyek berhasil dihapus')
        router.refresh()
      } else {
        toast.error(res.error || t('deleteError') || 'Gagal menghapus proyek')
      }
    } catch {
      toast.error(t('deleteError') || 'Gagal menghapus proyek')
    } finally {
      setIsDeleting(null)
      setModalConfig({ open: false, type: null, projectId: null })
    }
  }

  const getStatusConfig = (project: any) => {
    switch (project.status) {
      case 'WORKER_REVIEW':
        return {
          icon: <AlertCircle className="w-6 h-6 text-amber-600" />,
          bg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
          label: project.offeredPrice != null ? t('statusOfferReceived') : (t('statusWorkerReviewing') || 'Menunggu Penawaran'),
        }
      case 'PENDING_DP':
        return {
          icon: <Clock className="w-6 h-6 text-purple-600" />,
          bg: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
          label: t('statusPendingDP'),
        }
      case 'IN_PROGRESS':
        return {
          icon: <CircleDashed className="w-6 h-6 text-emerald-600" />,
          bg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
          label: t('statusInProgress'),
        }
      case 'COMPLETED':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-slate-600" />,
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600',
          label: t('statusCompleted'),
        }
      case 'ON_HOLD':
        return {
          icon: <Clock className="w-6 h-6 text-orange-600" />,
          bg: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600',
          label: t('statusOnHold'),
        }
      case 'CANCELLED':
        return {
          icon: <AlertCircle className="w-6 h-6 text-red-600" />,
          bg: 'bg-red-50 dark:bg-red-900/20 text-red-600',
          label: t('statusCancelled'),
        }
      default:
        return {
          icon: <CircleDashed className="w-6 h-6 text-blue-600" />,
          bg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
          label: t('statusRequested'),
        }
    }
  }

  if (projects.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <p className="text-slate-500">{t('noProjects')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* View Toggle */}
      <div className="flex justify-end mb-2">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg flex items-center justify-center transition-all ${
              viewMode === 'list' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            title="List View"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded-lg flex items-center justify-center transition-all ${
              viewMode === 'card' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            title="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={viewMode === 'list' ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {projects.map((project) => {
          const config = getStatusConfig(project)
          
          return (
            <div key={project.id} className={`flex ${viewMode === 'list' ? 'flex-col md:flex-row md:items-center justify-between' : 'flex-col'} p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-all hover:shadow-md group`}>
              <div className={`flex ${viewMode === 'card' ? 'flex-col' : 'items-center'} gap-4 mb-4 md:mb-0 w-full`}>
                <div className={`flex items-center justify-between w-full`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.bg.split(' ').slice(0, 2).join(' ')}`}>
                    {config.icon}
                  </div>
                  {viewMode === 'card' && (
                     <div className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 ${config.bg}`}>
                       {config.label}
                     </div>
                  )}
                </div>
                
                <div className={`${viewMode === 'card' ? 'mt-2 mb-2' : ''}`}>
                  <h4 className="font-semibold text-slate-900 dark:text-white line-clamp-1" title={project.title}>{project.title}</h4>
                  <p className="text-xs text-slate-500 mt-1.5 flex flex-col gap-1">
                    <span>{project.worker ? `${t('workerLabel')}: ${project.worker.name}` : t('awaitingWorker')}</span>
                    {project.offeredPrice && (
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {t('offerLabel')}: Rp {Number(project.offeredPrice).toLocaleString('id-ID')}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            
              <div className={`flex items-center ${viewMode === 'card' ? 'justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800' : 'gap-3'} flex-wrap w-full`}>
                {/* Status label (only in list mode) */}
                {viewMode === 'list' && (
                  <div className={`px-3 py-1 text-xs font-medium rounded-full ${config.bg}`}>
                    {config.label}
                  </div>
                )}
                
                <div className={`flex items-center gap-2 ${viewMode === 'card' ? 'w-full justify-between' : ''}`}>
                  <button
                    disabled={project.status === 'CANCELLED'}
                    onClick={() => project.status !== 'CANCELLED' && setChatProject(project)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
                      project.status === 'CANCELLED'
                        ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-800'
                        : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 cursor-pointer'
                    }`}
                    title={project.status === 'CANCELLED' ? "Pesan nonaktif untuk proyek yang dibatalkan" : undefined}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className={viewMode === 'card' ? 'hidden sm:inline' : ''}>{t('btnChat') || 'Pesan'}</span>
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {project.status === "PENDING_DP" && (
                      <Link
                        href={`/${locale}/client/billing`}
                        className="px-3.5 py-1.5 bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                      >
                        <span>Bayar DP</span>
                      </Link>
                    )}

                    {project.status === "WORKER_REVIEW" && project.offeredPrice != null && (
                      <button 
                        onClick={() => handleApprove(project.id)}
                        disabled={isApproving === project.id}
                        className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer shadow-sm flex items-center gap-2 whitespace-nowrap"
                      >
                        {isApproving === project.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          t('acceptOffer')
                        )}
                      </button>
                    )}

                    {['REQUESTED', 'WORKER_REVIEW', 'PENDING_DP'].includes(project.status) && (
                      <button
                        onClick={() => setModalConfig({ open: true, type: 'cancel', projectId: project.id })}
                        disabled={isCancelling === project.id}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                        title="Batalkan Proyek"
                      >
                        {isCancelling === project.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">Batal</span>
                      </button>
                    )}

                    {project.status === 'CANCELLED' && (
                      <button
                        onClick={() => setModalConfig({ open: true, type: 'delete', projectId: project.id })}
                        disabled={isDeleting === project.id}
                        className="px-3 py-1.5 bg-red-600 text-white hover:bg-red-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                        title="Hapus Permanen"
                      >
                        {isDeleting === project.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">Hapus</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
        )
      })}
      </div>

      {/* Project Chat Drawer for Client */}
      {chatProject && (
        <ProjectChatDrawer
          isOpen={!!chatProject}
          onClose={() => setChatProject(null)}
          projectId={chatProject.id}
          projectTitle={chatProject.title}
          currentUserId={currentUserId || ""}
          userRole="CLIENT"
          isCancelled={chatProject.status === "CANCELLED"}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal 
        open={modalConfig.open}
        onCancel={() => setModalConfig({ open: false, type: null, projectId: null })}
        onConfirm={() => {
          if (modalConfig.type === 'cancel' && modalConfig.projectId) {
            performCancel(modalConfig.projectId)
          } else if (modalConfig.type === 'delete' && modalConfig.projectId) {
            performDelete(modalConfig.projectId)
          }
        }}
        title={modalConfig.type === 'cancel' ? (t('confirmCancel') || "Batalkan Proyek?") : (t('confirmDelete') || "Hapus Proyek?")}
        description={modalConfig.type === 'cancel' ? "Apakah Anda yakin ingin membatalkan proyek ini? Tindakan ini tidak dapat dikembalikan." : "Apakah Anda yakin ingin menghapus proyek ini secara permanen? Seluruh data dan pesan akan hilang."}
        confirmText={modalConfig.type === 'cancel' ? "Ya, Batalkan" : "Ya, Hapus"}
        cancelText="Kembali"
        variant="destructive"
        isLoading={isCancelling === modalConfig.projectId || isDeleting === modalConfig.projectId}
      />
    </div>
  )
}
