'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Check, ArrowLeft, ExternalLink, Trash2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { getNotifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } from '@/app/actions/notification'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'

type Notification = {
  id: string
  userId: string
  title: string
  message: string
  type: string
  isRead: boolean
  link: string | null
  createdAt: string
}

export function NotificationBell({ userId }: { userId: string }) {
  const t = useTranslations("Notifications")
  const locale = useLocale()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      const res = await getNotifications()
      if (res.success && res.data) {
        setNotifications(res.data as any)
        setUnreadCount((res.data as Notification[]).filter(n => !n.isRead).length)
      }
    }
    
    fetchNotifications()

    // Subscribe to realtime updates
    const supabase = createClient()
    const channel = supabase
      .channel('realtime-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'Notification',
        filter: `userId=eq.${userId}`
      }, (payload) => {
        const newNotif = payload.new as Notification
        setNotifications(prev => [newNotif, ...prev])
        setUnreadCount(prev => prev + 1)
        toast.info(newNotif.title, { description: newNotif.message })
      })
      .subscribe()

    // Click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      supabase.removeChannel(channel)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userId])

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  const handleDeleteSingle = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const target = notifications.find(n => n.id === id)
    await deleteNotification(id)
    setNotifications(prev => prev.filter(n => n.id !== id))
    if (target && !target.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
    toast.success(t("deletedToast"))
  }

  const handleClearAll = async () => {
    await clearAllNotifications()
    setNotifications([])
    setUnreadCount(0)
    toast.success(t("clearedToast"))
  }

  const handleNotificationClick = (notif: Notification) => {
    if (!notif.isRead) {
      handleMarkAsRead(notif.id)
    }
    setSelectedNotif(notif)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        suppressHydrationWarning
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >

        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
          {selectedNotif ? (
            // Detail View
            <>
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                <button 
                  onClick={() => setSelectedNotif(null)}
                  className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{t("detailTitle")}</h3>
              </div>
              <div className="p-5 overflow-y-auto">
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">{selectedNotif.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap mb-4">
                  {selectedNotif.message}
                </p>
                <div className="text-xs text-slate-400 font-medium mb-6">
                  {new Date(selectedNotif.createdAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US")} {t("timeAt")} {new Date(selectedNotif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                
                {selectedNotif.link && (
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setSelectedNotif(null)
                      router.push(selectedNotif.link!)
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                  >
                    {t("openLink")} <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            // List View
            <>
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{t("title")}</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllAsRead}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                      title={t("markAllReadTooltip")}
                    >
                      <Check className="w-3.5 h-3.5" /> {t("markAllRead")}
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs font-medium text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                      title={t("clearAllTooltip")}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> {t("clearAll")}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center text-slate-500">
                    <Bell className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-sm">{t("empty")}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 relative group ${!notif.isRead ? 'bg-red-50/20 dark:bg-red-900/10' : ''}`}
                      >
                        <div className="flex gap-3 pr-6">
                          <div className={`w-2.5 h-2.5 mt-1 rounded-full shrink-0 ${!notif.isRead ? 'bg-red-500' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                              {notif.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                              {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleDeleteSingle(e, notif.id)}
                          className="absolute right-3 top-3.5 p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors opacity-0 group-hover:opacity-100"
                          title={t("deleteTooltip")}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
