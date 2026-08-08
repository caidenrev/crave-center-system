'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from "framer-motion"
import { LayoutDashboard, FileText, CheckSquare, Settings, LogOut, Package, DollarSign, Wallet, Globe, Search, ChevronsUpDown, Plus } from 'lucide-react'
import { cn, getDefaultAvatar } from '@/lib/utils'
import { ConfirmModal } from '@/components/ui/confirm-modal'

function TopBrandHeader({ locale }: { locale: string }) {
  return (
    <div className="h-16 flex items-center justify-between px-4 mt-2">
      <Link href={`/${locale}/client`} className="flex items-center gap-3 w-full p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
          <img src="/light-mode-logo.png" alt="Crave" className="h-5 w-auto brightness-0 invert" />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-bold text-sm text-slate-900 dark:text-white leading-tight">Crave ITSM</span>
          <span className="text-xs text-slate-500 font-medium">Client Workspace</span>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    </div>
  );
}

export function ClientSidebar({ 
  locale,
  user,
  isOpen,
  onClose
}: { 
  locale: string;
  user?: { name?: string | null; email?: string | null; image?: string | null } | null;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('ClientSidebar')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const navItems = [
    {
      title: "",
      items: [
        { name: t('dashboard'), href: `/${locale}/client`, icon: LayoutDashboard },
        { name: t('website') || "Website", href: `/${locale}`, icon: Globe },
        { name: t('requests'), href: `/${locale}/client/request`, icon: FileText },
        { name: t('projects'), href: `/${locale}/client/projects`, icon: CheckSquare },
        { name: t('deliverables') || 'Deliverables', href: `/${locale}/client/deliverables`, icon: Package },
        { name: t('contracts'), href: `/${locale}/client/contracts`, icon: FileText },
        { name: t('paymentHistory') || 'Finance', href: `/${locale}/client/billing`, icon: Wallet },
      ]
    }
  ]

  const bottomItems = [
    { name: t('settings'), href: `/${locale}/client/settings`, icon: Settings },
    { name: t('logout'), href: `/${locale}/auth/logout`, icon: LogOut, isLogout: true },
  ]

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false)
    router.push(`/${locale}/auth/logout`)
  }

  return (
    <>
      <aside className={cn(
        "w-64 bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-slate-800 shrink-0 flex flex-col",
        "fixed inset-y-0 left-0 z-40 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <TopBrandHeader locale={locale} />

        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
          {/* Search Bar */}
          <div className="px-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 border border-slate-200 dark:border-slate-800 transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
              <Search className="w-4 h-4 shrink-0" />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder') || "Search..."} 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 flex-1 px-1">
            {navItems.map((group, idx) => (
              <div key={idx}>
                {group.title && (
                  <div className="flex items-center justify-between mb-2 px-2">
                    <h4 className="text-xs font-medium text-slate-400 dark:text-slate-500">
                      {group.title}
                    </h4>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const isDashboardOrHome = item.href === `/${locale}/client` || item.href === `/${locale}`;
                    const isActive = isDashboardOrHome ? pathname === item.href : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200",
                          isActive
                            ? "bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-900 dark:text-white"
                            : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/30 dark:hover:text-white"
                        )}
                      >
                        <item.icon className={cn("w-4 h-4", isActive ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500")} />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2">
            <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-4 text-white flex flex-col items-center text-center gap-2 shadow-sm">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-xs">{t('ctaTitle')}</h4>
                <p className="text-[10px] text-slate-300 mt-0.5 opacity-80 leading-tight">{t('ctaDesc')}</p>
              </div>
              <Link href={`/${locale}/client/request/new`} className="w-full py-1.5 bg-primary hover:bg-primary/90 text-white text-[11px] font-medium rounded-lg transition-colors text-center mt-1">
                {t('ctaBtn')}
              </Link>
            </div>
          </div>

          {/* Profile Info & Dropdown */}
          <div className="px-1 mb-2 mt-auto relative">
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-1 right-1 mb-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-xl p-1.5 z-50 flex flex-col gap-0.5"
                >
                  {bottomItems.map((item) => {
                    if (item.isLogout) {
                      return (
                        <button
                          key={item.name}
                          onClick={() => {
                            setIsProfileOpen(false);
                            setShowLogoutModal(true);
                          }}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                        >
                          <item.icon className="w-4 h-4 text-red-500 dark:text-red-400" />
                          {item.name}
                        </button>
                      )
                    }
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => {
                          setIsProfileOpen(false)
                          onClose?.()
                        }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                          pathname === item.href
                            ? "bg-slate-100 dark:bg-slate-800/60 font-semibold text-slate-900 dark:text-white"
                            : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white"
                        )}
                      >
                        <item.icon className={cn("w-4 h-4", pathname === item.href ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500")} />
                        {item.name}
                      </Link>
                    )
                  })}
                </motion.div>
              </>
            )}
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-between p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <img 
                  src={user?.image || getDefaultAvatar(user?.name || user?.email || "Client")} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-slate-700" 
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate leading-tight">{user?.name || "Client"}</span>
                  <span className="text-[10px] text-slate-500 truncate">{user?.email || "client@crave.com"}</span>
                </div>
              </div>
              <ChevronsUpDown className="w-4 h-4 text-slate-400 shrink-0 transition-opacity" />
            </div>
          </div>
        </div>
      </aside>

      <ConfirmModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title={t('logoutModalTitle')}
        description={t('logoutModalDesc')}
        confirmText={t('logoutModalConfirm')}
        cancelText={t('logoutModalCancel')}
        variant="destructive"
      />
    </>
  )
}
