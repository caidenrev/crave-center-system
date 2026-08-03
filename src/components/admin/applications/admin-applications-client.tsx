'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  MessageCircle,
  Search,
  Filter,
  X,
  User,
  Briefcase,
  Calendar,
  FileText,
  Loader2,
  Phone,
  Globe,
  Code2,
} from 'lucide-react'
import { reviewApplication } from '@/app/actions/application'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export interface ApplicationItem {
  id: string
  userName: string
  userEmail: string
  category: string
  skills: string[]
  portfolioUrl?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  instagramUrl?: string | null
  tiktokUrl?: string | null
  reason: string
  whatsapp: string
  email: string
  createdAt: string
}

export function AdminApplicationsClient({ applications }: { applications: ApplicationItem[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const router = useRouter()
  const t = useTranslations('AdminApplications')

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = categoryFilter === 'ALL' || app.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const handleReview = async (appId: string, action: 'APPROVE' | 'REJECT') => {
    setLoadingId(appId)
    setLoadingAction(action)
    const res = await reviewApplication(appId, action)
    
    if (res.success) {
      toast.success(action === 'APPROVE' ? t('approved') : t('rejected'))
      router.refresh()
    } else {
      toast.error(res.error || t('error'))
    }
    setLoadingId(null)
    setLoadingAction(null)
  }

  const handleInterview = (app: ApplicationItem) => {
    // Open WhatsApp with pre-filled message
    const message = encodeURIComponent(
      `Hi ${app.userName}, this is Crave ITSM Admin.\n\nWe've reviewed your application and would like to schedule an interview with you.\n\nPlease let us know your availability for a brief online interview.\n\nThank you!`
    )
    const waNumber = app.whatsapp.replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
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

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {[
            { id: 'ALL', label: t('filterAll') },
            { id: 'IT', label: t('filterIT') },
            { id: 'NON_IT', label: t('filterNonIT') },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setCategoryFilter(filter.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === filter.id
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Application Cards Grid */}
      {filteredApps.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-xs">
          <User className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">{t('noApplications')}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('noApplicationsDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredApps.map((app) => {
            const isExpanded = expandedId === app.id
            const isLoading = loadingId === app.id

            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30 flex flex-col justify-between"
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary via-indigo-500 to-purple-600 p-0.5 shadow-md shrink-0">
                      <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center text-white font-extrabold text-lg">
                        {app.userName.charAt(0)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">{app.userName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">{app.userEmail}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          app.category === 'IT' 
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' 
                            : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                        }`}>
                          <Briefcase className="w-3 h-3 mr-1" />
                          {app.category === 'IT' ? 'IT & Software' : 'Creative & Non-IT'}
                        </span>
                        <span suppressHydrationWarning className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {app.createdAt ? app.createdAt.split('T')[0] : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Tag List */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {app.skills.map(s => (
                      <span key={s} className="px-2.5 py-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold border border-slate-200/50 dark:border-slate-700/50">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expandable Details */}
                {isExpanded && (
                  <div className="px-6 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-primary" /> {t('reasonJoining')}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        {app.reason}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {app.portfolioUrl && (
                        <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                          <Globe className="w-3.5 h-3.5" /> Portfolio
                        </a>
                      )}
                      {app.githubUrl && (
                        <a href={app.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors">
                          <Code2 className="w-3.5 h-3.5" /> GitHub
                        </a>
                      )}
                      {app.linkedinUrl && (
                        <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[11px] font-bold border border-sky-500/20 hover:bg-sky-500/20 transition-colors">
                          <Globe className="w-3.5 h-3.5" /> LinkedIn
                        </a>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1 font-mono">
                      <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <Phone className="w-3.5 h-3.5" /> {app.whatsapp}
                      </span>
                      <span>•</span>
                      <span>{app.email}</span>
                    </div>
                  </div>
                )}

                {/* Card Footer - Actions */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : app.id)}
                      className="text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      {isExpanded ? t('showLess') : t('viewDetails')}
                    </button>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {/* Schedule Interview */}
                      <button
                        onClick={() => handleInterview(app)}
                        disabled={isLoading}
                        className="px-3 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> {t('interview')}
                      </button>

                      {/* Reject */}
                      <button
                        onClick={() => handleReview(app.id, 'REJECT')}
                        disabled={isLoading}
                        className="px-3 py-2 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isLoading && loadingAction === 'REJECT' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                        {t('reject')}
                      </button>

                      {/* Approve */}
                      <button
                        onClick={() => handleReview(app.id, 'APPROVE')}
                        disabled={isLoading}
                        className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/25 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {isLoading && loadingAction === 'APPROVE' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        {t('approve')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
