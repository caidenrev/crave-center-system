'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LayoutDashboard, CheckSquare, DollarSign, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export function WorkerSidebar({ locale }: { locale: string }) {
  const pathname = usePathname()
  const t = useTranslations('WorkerSidebar')

  const menuItems = [
    {
      name: t('dashboard'),
      href: `/${locale}/worker`,
      icon: LayoutDashboard,
    },
    {
      name: t('tasks'),
      href: `/${locale}/worker/tasks`,
      icon: CheckSquare,
    },
    {
      name: t('earnings'),
      href: `/${locale}/worker/earnings`,
      icon: DollarSign,
    }
  ]

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-xl">
          C
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Crave</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-3">
          MENU
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400 dark:text-slate-500")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Link href={`/${locale}/auth/logout`} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 w-full transition-all duration-200">
          <LogOut className="w-5 h-5" />
          Log out
        </Link>
      </div>
    </aside>
  )
}
