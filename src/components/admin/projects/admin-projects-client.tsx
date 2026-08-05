'use client'

import { useState } from 'react'
import {
  PlayCircle,
  CheckCircle,
  Clock,
  Search,
  X,
  User,
  ChevronRight,
  FolderKanban,
  MessageSquare,
  AlertCircle,
  CircleDashed,
  ShieldCheck,
  LayoutGrid,
  List,
  FileText,
} from 'lucide-react'

import { useTranslations } from 'next-intl'
import { ProjectChatDrawer } from '@/components/chat/project-chat-drawer'
import { AdminCreateTermsModal } from './admin-create-terms-modal'

export interface ProjectCardItem {
  id: string
  fullProjectId?: string
  name: string
  client: string
  manager: string
  status: string
  progress: number
  dueDate: string
  description?: string
  budget?: string
}

interface AdminProjectsClientProps {
  initialProjects: ProjectCardItem[]
  currentUserId?: string
}

export function AdminProjectsClient({ initialProjects, currentUserId }: AdminProjectsClientProps) {
  const [projects] = useState<ProjectCardItem[]>(initialProjects)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedProject, setSelectedProject] = useState<ProjectCardItem | null>(null)
  const [chatProject, setChatProject] = useState<ProjectCardItem | null>(null)
  const [termsModalProject, setTermsModalProject] = useState<ProjectCardItem | null>(null)
  const t = useTranslations('AdminProjects')

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'ALL' || p.status.toLowerCase().replace(/\s+/g, '_') === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'REQUESTED':
      case 'Requested':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500 text-white shadow-sm border-none">
            <CircleDashed className="w-3.5 h-3.5" /> {t('statusRequested') || 'Diajukan'}
          </span>
        )
      case 'IN_PROGRESS':
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm border-none">
            <PlayCircle className="w-3.5 h-3.5" /> {t('filterInProgress') || 'Berlangsung'}
          </span>
        )
      case 'WORKER_REVIEW':
      case 'Worker Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500 text-white shadow-sm border-none">
            <AlertCircle className="w-3.5 h-3.5" /> {t('statusWorkerReview') || 'Review Worker'}
          </span>
        )
      case 'PENDING_DP':
      case 'Pending DP':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm border-none">
            <Clock className="w-3.5 h-3.5" /> {t('statusPendingDP') || 'Menunggu DP'}
          </span>
        )
      case 'COMPLETED':
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm border-none">
            <CheckCircle className="w-3.5 h-3.5" /> {t('filterCompleted') || 'Selesai'}
          </span>
        )
      case 'ON_HOLD':
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-sm border-none">
            <Clock className="w-3.5 h-3.5" /> {t('filterOnHold') || 'Tertunda / Jeda'}
          </span>
        )
      case 'IN_WARRANTY':
      case 'Warranty':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500 text-white shadow-sm border-none">
            <ShieldCheck className="w-3.5 h-3.5" /> {t('statusInWarranty') || 'Garansi'}
          </span>
        )
      case 'CANCELLED':
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-sm border-none">
            <AlertCircle className="w-3.5 h-3.5" /> {t('statusCancelled') || 'Dibatalkan'}
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


  return (
    <div className="space-y-6">

      {/* Toolbar: Search, Filter, View Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-5 shadow-xs space-y-4">
        
        {/* Top Row: Search Input & View Switcher */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              suppressHydrationWarning
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} suppressHydrationWarning className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Switcher */}
          <div className="flex items-center justify-end">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                suppressHydrationWarning
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
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
                    ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Status Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 dark:border-slate-800/80 pt-3">
          {[
            { id: 'ALL', label: t('filterAll') || 'All Status' },
            { id: 'WORKER_REVIEW', label: t('statusWorkerReview') || 'Worker Review' },
            { id: 'PENDING_DP', label: t('statusPendingDP') || 'Pending DP' },
            { id: 'IN_PROGRESS', label: t('filterInProgress') || 'In Progress' },
            { id: 'ON_HOLD', label: t('filterOnHold') || 'Delayed / Hold' },
            { id: 'IN_WARRANTY', label: t('statusInWarranty') || 'Warranty' },
            { id: 'COMPLETED', label: t('filterCompleted') || 'Completed' },
            { id: 'CANCELLED', label: t('statusCancelled') || 'Cancelled' },
          ].map(f => (
            <button
              key={f.id}
              suppressHydrationWarning
              onClick={() => setStatusFilter(f.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                statusFilter === f.id
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
          <FolderKanban className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">Tidak ada proyek ditemukan</h3>
          <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(proj => (
            <div 
              key={proj.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40 group relative overflow-hidden"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 tracking-wider">
                    {proj.id}
                  </span>
                  {getStatusBadge(proj.status)}
                </div>

                <div className="space-y-1 mb-5">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug cursor-pointer" onClick={() => setSelectedProject(proj)}>
                    {proj.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    {t('clientLabel')}: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{proj.client}</strong>
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <User className="w-3.5 h-3.5 text-primary" /> {t('assignedWorker')}
                    </span>
                    <span className="font-bold bg-blue-500 text-white px-3 py-1 rounded-full text-[11px] shadow-sm tracking-wider">{proj.manager}</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('completion')}</span>
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 leading-none">{proj.progress}%</span>
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
                        {proj.progress > 0 && (
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            className={
                              proj.progress === 100
                                ? 'stroke-emerald-500'
                                : proj.status === 'ON_HOLD'
                                ? 'stroke-amber-500'
                                : 'stroke-blue-500'
                            }
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${(proj.progress / 100) * (Math.PI * 40)} ${Math.PI * 40}`}
                          />
                        )}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elegant Action Panel */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <button
                  suppressHydrationWarning
                  disabled={proj.status === 'CANCELLED'}
                  onClick={() => proj.status !== 'CANCELLED' && setTermsModalProject(proj)}
                  className={`w-full py-2 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    proj.status === 'CANCELLED'
                      ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-800'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer shadow-md'
                  }`}
                  title={proj.status === 'CANCELLED' ? "Ketentuan & Kontrak nonaktif untuk proyek yang dibatalkan" : "Ketentuan & Kontrak"}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('btnTerms') || 'Ketentuan & Kontrak'}</span>
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

                  <button
                    suppressHydrationWarning
                    onClick={() => setSelectedProject(proj)}
                    className="w-full py-2 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <span>{t('btnDetail') || t('view') || 'Detail'}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 uppercase text-slate-500 dark:text-slate-400 font-bold text-xs border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">{t('thId')}</th>
                  <th className="px-6 py-4">{t('thProjectName')}</th>
                  <th className="px-6 py-4">{t('clientLabel')}</th>
                  <th className="px-6 py-4">{t('assignedWorker')}</th>
                  <th className="px-6 py-4">{t('thStatus')}</th>
                  <th className="px-6 py-4">{t('completion')}</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredProjects.map((p) => (
                  <tr 
                    key={p.id} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-xs text-slate-900 dark:text-slate-200">{p.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{p.name}</td>
                    <td className="px-6 py-4">{p.client}</td>
                    <td className="px-6 py-4 font-semibold">{p.manager}</td>
                    <td className="px-6 py-4">{getStatusBadge(p.status)}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{p.progress}%</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={p.status === 'CANCELLED'}
                          onClick={() => p.status !== 'CANCELLED' && setTermsModalProject(p)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                            p.status === 'CANCELLED'
                              ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-800'
                              : 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 cursor-pointer'
                          }`}
                          title={p.status === 'CANCELLED' ? "Ketentuan & Kontrak nonaktif untuk proyek yang dibatalkan" : undefined}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{t('btnTerms') || 'Ketentuan & Kontrak'}</span>
                        </button>
                        <button
                          disabled={p.status === 'CANCELLED'}
                          onClick={() => p.status !== 'CANCELLED' && setChatProject(p)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                            p.status === 'CANCELLED'
                              ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-800'
                              : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 cursor-pointer'
                          }`}
                          title={p.status === 'CANCELLED' ? "Pesan nonaktif untuk proyek yang dibatalkan" : undefined}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{t('btnChat') || 'Pesan'}</span>
                        </button>
                        <button
                          onClick={() => setSelectedProject(p)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          {t('btnDetail') || t('view') || 'Detail'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 md:p-8 max-w-md w-full shadow-2xl relative flex flex-col">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-6 mb-2">
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20">
                {selectedProject.id}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3">{selectedProject.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('clientLabel')}: {selectedProject.client}</p>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl space-y-2 border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('assignedWorker')}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedProject.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('dueDate')}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedProject.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('completion')}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedProject.progress}%</span>
                </div>
              </div>
              {selectedProject.description && (
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Deskripsi:</span>
                  <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/20 p-3 rounded-xl">
                    {selectedProject.description}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between gap-3">
              <button
                disabled={selectedProject.status === 'CANCELLED'}
                onClick={() => {
                  if (selectedProject.status !== 'CANCELLED') {
                    const p = selectedProject
                    setSelectedProject(null)
                    setChatProject(p)
                  }
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                  selectedProject.status === 'CANCELLED'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200/50 dark:border-slate-800'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 cursor-pointer'
                }`}
                title={selectedProject.status === 'CANCELLED' ? "Pesan nonaktif untuk proyek yang dibatalkan" : undefined}
              >
                <MessageSquare className="w-4 h-4" /> {t('btnChat') || 'Pesan'}
              </button>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Realtime Chat Drawer */}
      {chatProject && (
        <ProjectChatDrawer
          isOpen={!!chatProject}
          onClose={() => setChatProject(null)}
          projectId={chatProject.fullProjectId || chatProject.id}
          projectTitle={chatProject.name}
          currentUserId={currentUserId || ""}
          userRole="ADMIN"
          isCancelled={chatProject.status === "CANCELLED"}
        />
      )}

      {/* Admin Create Terms & Contract Modal */}
      {termsModalProject && (
        <AdminCreateTermsModal
          isOpen={!!termsModalProject}
          onClose={() => setTermsModalProject(null)}
          projectId={termsModalProject.fullProjectId || termsModalProject.id}
          projectTitle={termsModalProject.name}
        />
      )}
    </div>
  )
}
