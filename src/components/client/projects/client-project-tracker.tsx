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
  List
} from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { ProjectChatDrawer } from '@/components/chat/project-chat-drawer'

export interface ClientProjectCardItem {
  id: string
  title: string
  status: string
  targetDeliveryDate: string
  createdAt?: string
  worker?: { name: string } | null
  offeredPrice?: string | null
}

interface ClientProjectTrackerProps {
  projects: ClientProjectCardItem[]
  currentUserId?: string
}

export function ClientProjectTracker({ projects, currentUserId }: ClientProjectTrackerProps) {
  const [chatProject, setChatProject] = useState<ClientProjectCardItem | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const t = useTranslations('ClientProjects')
  const locale = useLocale()

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

  // Calculate dummy progress based on status
  const getProgress = (status: string) => {
    switch (status) {
      case 'REQUESTED': return 10
      case 'WORKER_REVIEW': return 25
      case 'PENDING_DP': return 40
      case 'IN_PROGRESS': return 65
      case 'ON_HOLD': return 65
      case 'COMPLETED': return 100
      case 'CANCELLED': return 0
      default: return 0
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {projects.map(proj => {
          const progress = getProgress(proj.status)
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
                  <h3 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white leading-snug cursor-default">
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

                  <Link
                    href={`/${locale}/client/projects`}
                    className="w-full py-2 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <span>Detail</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  </Link>
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
                  const progress = getProgress(proj.status)
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
                          <Link
                            href={`/${locale}/client/projects`}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            Detail
                          </Link>
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
    </div>
  )
}
