'use client'

import { useState } from 'react'
import {
  LayoutGrid,
  List,
  PlayCircle,
  CheckCircle,
  Clock,
  Search,
  X,
  Calendar,
  User,
  ChevronRight,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

export interface ProjectCardItem {
  id: string
  name: string
  client: string
  manager: string
  status: string
  progress: number
  dueDate: string
  description?: string
  budget?: string
}

export function AdminProjectsClient({ initialProjects }: { initialProjects: ProjectCardItem[] }) {
  const [projects] = useState<ProjectCardItem[]>(initialProjects)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedProject, setSelectedProject] = useState<ProjectCardItem | null>(null)
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
      case 'In Progress':
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <PlayCircle className="w-3.5 h-3.5" /> {t('filterInProgress')}
          </span>
        )
      case 'Completed':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" /> {t('filterCompleted')}
          </span>
        )
      case 'Delayed':
      case 'ON_HOLD':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> {t('filterOnHold')}
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

  return (
    <div className="space-y-6">

      {/* Toolbar: Search, Filter, View Switcher */}
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

        {/* Status Filter & View Switcher */}
        <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: t('filterAll') },
              { id: 'IN_PROGRESS', label: t('filterInProgress') },
              { id: 'COMPLETED', label: t('filterCompleted') },
              { id: 'ON_HOLD', label: t('filterOnHold') },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-950 text-primary shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-white dark:bg-slate-950 text-primary shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div 
              key={proj.id} 
              onClick={() => setSelectedProject(proj)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40 cursor-pointer group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 tracking-wider">
                  {proj.id}
                </span>
                {getStatusBadge(proj.status)}
              </div>

              <div className="space-y-1 mb-5">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
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
                  <span className="font-bold text-slate-800 dark:text-slate-200">{proj.manager}</span>
                </div>

                <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 transition-all hover:bg-slate-50 dark:hover:bg-slate-800">
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
                              : proj.status === 'Delayed' || proj.status === 'ON_HOLD'
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

                <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" /> {t('dueDate')}: {proj.dueDate}
                  </span>
                  <span className="text-primary font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    {t('view')} <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 uppercase text-slate-500 dark:text-slate-400 font-bold text-xs border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Project Name</th>
                  <th className="px-6 py-4">{t('clientLabel')}</th>
                  <th className="px-6 py-4">{t('assignedWorker')}</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">{t('completion')}</th>
                  <th className="px-6 py-4">{t('dueDate')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredProjects.map((p) => (
                  <tr 
                    key={p.id} 
                    onClick={() => setSelectedProject(p)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-xs text-slate-900 dark:text-slate-200">{p.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{p.name}</td>
                    <td className="px-6 py-4">{p.client}</td>
                    <td className="px-6 py-4 font-semibold">{p.manager}</td>
                    <td className="px-6 py-4">{getStatusBadge(p.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-4 flex items-end justify-center">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="16" strokeLinecap="round" />
                            <path 
                              d="M 10 50 A 40 40 0 0 1 90 50" 
                              fill="none" 
                              className={
                                p.progress === 100 ? 'stroke-emerald-500' : p.status === 'Delayed' || p.status === 'ON_HOLD' ? 'stroke-amber-500' : 'stroke-blue-500'
                              } 
                              strokeWidth="16" strokeLinecap="round" strokeDasharray={`${(p.progress / 100) * (Math.PI * 40)} ${Math.PI * 40}`} 
                            />
                          </svg>
                        </div>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{p.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative space-y-6">
            <button 
              onClick={() => setSelectedProject(null)} 
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20">
                {selectedProject.id}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3">{selectedProject.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('clientLabel')}: {selectedProject.client}</p>
            </div>

            <div className="space-y-4 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">{t('assignedWorker')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{selectedProject.manager}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">{t('targetDate')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{selectedProject.dueDate}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block mb-1.5">{t('completion')} ({selectedProject.progress}%)</span>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedProject.progress}%` }} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
