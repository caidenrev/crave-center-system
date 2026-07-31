'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LayoutDashboard, FileText, CheckSquare, MessageSquare, Settings, LogOut, Package, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ClientSidebar({ locale }: { locale: string }) {
  const pathname = usePathname()
  const t = useTranslations('ClientSidebar')

  const navItems = [
    {
      title: t('menu'),
      items: [
        { name: t('dashboard'), href: `/${locale}/client`, icon: LayoutDashboard },
        { name: t('requests'), href: `/${locale}/client/request`, icon: FileText },
        { name: t('projects'), href: `/${locale}/client/projects`, icon: CheckSquare },
        { name: t('contracts'), href: `/${locale}/client/contracts`, icon: FileText },
        { name: t('paymentHistory'), href: `/${locale}/client/payments`, icon: DollarSign },
      ]
    },
    {
      title: t('general'),
      items: [
        { name: t('settings'), href: `/${locale}/client/settings`, icon: Settings },
        { name: t('logout'), href: `/${locale}/auth/logout`, icon: LogOut },
      ]
    }
  ]

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <Link href={`/${locale}/client`} className="flex items-center group">
          <img src="/light-mode-logo.png" alt="Crave" className="h-7 w-auto dark:hidden transition-transform group-hover:scale-105" />
          <img src="/dark-mode-logo.png" alt="Crave" className="h-7 w-auto hidden dark:block transition-transform group-hover:scale-105" />
          <span className="font-bold text-xl ml-2 text-slate-900 dark:text-white">Crave</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
        {navItems.map((group) => (
          <div key={group.title}>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider mb-3 px-3 uppercase">
              {group.title}
            </h4>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400 dark:text-slate-500")} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4">
        <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-5 text-white flex flex-col items-center text-center gap-3 shadow-xl">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">{t('ctaTitle')}</h4>
            <p className="text-xs text-slate-300 mt-1 opacity-80">{t('ctaDesc')}</p>
          </div>
          <Link href={`/${locale}/client/request/new`} className="w-full py-2 bg-primary hover:bg-primary/90 text-white text-xs font-medium rounded-lg transition-colors">
            {t('ctaBtn')}
          </Link>
        </div>
      </div>
    </aside>
  )
}
