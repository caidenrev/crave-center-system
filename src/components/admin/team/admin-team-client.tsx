'use client'

import { useState } from 'react'
import { Briefcase, Activity, Mail, Search, Filter, CheckCircle2, X, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'

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
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 group"
            >
              {/* Top Section - Avatar & Profile */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary via-indigo-500 to-purple-600 p-0.5 shadow-md shrink-0">
                      <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white font-extrabold text-xl">
                        {member.name.charAt(0)}
                      </div>
                    </div>
                    {/* Status Dot */}
                    <div 
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-xs ${
                        member.status === 'Available' ? 'bg-emerald-500' : member.status === 'Busy' ? 'bg-rose-500' : 'bg-amber-500'
                      }`} 
                      title={`Status: ${member.status}`} 
                    />
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${
                    member.status === 'Available' 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : member.status === 'Busy'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  }`}>
                    {member.status === 'Available' ? t('filterAvailable') : member.status === 'Busy' ? t('filterBusy') : t('filterAway')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-0.5 group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {member.role}
                </p>

                {/* Skills Pills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {member.skills.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold border border-slate-200/50 dark:border-slate-700/50">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Redesigned Active Tasks & Workload Capacity Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
                      <Activity className="w-3.5 h-3.5 text-primary" /> {t('activeTasks')}
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                      {member.activeTasks} / {member.maxCapacity} {t('tasksLabel')}
                    </span>
                  </div>
                  
                  <div className="w-full h-2.5 bg-slate-200/70 dark:bg-slate-700/70 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        workloadPercentage >= 80 ? 'bg-rose-500' : workloadPercentage >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${workloadPercentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] pt-0.5 font-bold">
                    <span className="text-slate-400">{t('capacityUsed')}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] ${
                      workloadPercentage >= 80 
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {workloadPercentage}% {t('capacityLabel')}
                    </span>
                  </div>
                </div>

                {/* Message Worker Button */}
                <button 
                  onClick={() => setMessagingMember(member)}
                  className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex justify-center items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-primary" /> {t('messageWorker')}
                </button>
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
