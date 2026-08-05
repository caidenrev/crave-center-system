'use client'

import { useState } from 'react'
import { Briefcase, Activity, Mail, Search, Filter, CheckCircle2, X, Send, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getDefaultAvatar } from '@/lib/utils'

export interface TeamMemberItem {
  id: string
  name: string
  email: string
  role: string
  status: 'Available' | 'Busy' | 'Away'
  activeTasks: number
  maxCapacity: number
  skills: string[]
}

export function AdminTeamClient({ initialTeam }: { initialTeam: TeamMemberItem[] }) {
  const [team] = useState<TeamMemberItem[]>(initialTeam)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [messagingMember, setMessagingMember] = useState<TeamMemberItem | null>(null)
  const [messageText, setMessageText] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const t = useTranslations('AdminTeam')

  const filteredTeam = team.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'ALL' || m.status.toUpperCase() === statusFilter.toUpperCase()

    return matchesSearch && matchesStatus
  })

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messagingMember || !messageText.trim()) return

    setToastMessage(`${t('messageSent')} ${messagingMember.name}`)
    setMessageText('')
    setMessagingMember(null)
    setTimeout(() => setToastMessage(null), 3000)
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

      {/* Control Bar */}
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
            { id: 'AVAILABLE', label: t('filterAvailable') },
            { id: 'BUSY', label: t('filterBusy') },
            { id: 'AWAY', label: t('filterAway') },
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

      {/* Grid of Team Member Cards - Flexible 2-col on Mobile/Tablet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((member) => {
          const workloadPercentage = Math.min(Math.round((member.activeTasks / member.maxCapacity) * 100), 100)
          
          return (
            <div 
              key={member.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group relative overflow-hidden"
            >
              {/* Top Section - Avatar & Status Badge */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full shadow-md overflow-hidden shrink-0">
                    <img
                      src={getDefaultAvatar(member.name || member.email || 'default')}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className={`px-2.5 py-1 flex items-center gap-1.5 rounded-full text-[11px] font-extrabold text-white shadow-sm border-none ${
                  member.status === 'Available' 
                    ? 'bg-emerald-500'
                    : member.status === 'Busy'
                    ? 'bg-rose-500'
                    : 'bg-amber-500'
                }`}>
                  {member.status === 'Available' ? <CheckCircle2 className="w-3 h-3" /> : member.status === 'Busy' ? <Activity className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  {member.status === 'Available' ? t('filterAvailable') : member.status === 'Busy' ? t('filterBusy') : t('filterAway')}
                </span>
              </div>

              {/* Profile Details */}
              <div>
                <div className="space-y-1 mb-5">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug cursor-pointer">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1">
                    Keahlian: <strong className="text-slate-700 dark:text-slate-300 font-semibold line-clamp-1">{member.skills.join(', ')}</strong>
                  </p>
                </div>

                {/* Redesigned Active Tasks & Workload Capacity Section */}
                <div className="space-y-4 pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                      <User className="w-3.5 h-3.5 text-primary" /> Role Ditugaskan
                    </span>
                    <span className="font-bold bg-blue-500 text-white px-3 py-1 rounded-full text-[11px] uppercase tracking-wider shadow-sm">
                      {member.role === 'NON_IT' ? 'Non-IT' : member.role.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('capacityUsed')}</span>
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 leading-none">{workloadPercentage}%</span>
                      <span className="text-[10px] text-slate-400 mt-1 font-medium">{member.activeTasks} / {member.maxCapacity} {t('tasksLabel')}</span>
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
                        {workloadPercentage > 0 && (
                          <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            className={
                              workloadPercentage >= 80
                                ? 'stroke-rose-500'
                                : workloadPercentage >= 50
                                ? 'stroke-amber-500'
                                : 'stroke-emerald-500'
                            }
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${(workloadPercentage / 100) * (Math.PI * 40)} ${Math.PI * 40}`}
                          />
                        )}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Elegant Action Panel */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <button
                    suppressHydrationWarning
                    className="w-full py-2 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700 cursor-pointer shadow-2xs group"
                  >
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span>Lihat Profil Lengkap</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      suppressHydrationWarning
                      onClick={() => setMessagingMember(member)}
                      className="w-full py-2 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white border-none cursor-pointer shadow-md"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span>{t('messageWorker')}</span>
                    </button>

                    <button
                      suppressHydrationWarning
                      className="w-full py-2 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700 cursor-pointer shadow-2xs group"
                    >
                      <span>Detail Tugas</span>
                      <span className="opacity-70 group-hover:opacity-100 transition-opacity">&gt;</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredTeam.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-xs">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('noResults')}</p>
        </div>
      )}

      {/* Message Modal */}
      {messagingMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form onSubmit={handleSendMessage} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative space-y-5">
            <button 
              type="button"
              onClick={() => setMessagingMember(null)} 
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('sendMessage')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('sendMessageDesc')} <strong className="text-slate-800 dark:text-slate-200">{messagingMember.name}</strong></p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">{t('messageContent')}</label>
              <textarea
                required
                rows={4}
                placeholder={t('messagePlaceholder')}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMessagingMember(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/25 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> {t('sendBtn')}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}
