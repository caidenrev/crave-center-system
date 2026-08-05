'use client'

import { Menu } from 'lucide-react'
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NotificationBell } from './notification-bell'

import { getUserAvatar } from '@/lib/utils'

type UserProps = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function AdminTopbar({ user, onMenuToggle }: { user?: UserProps | null; onMenuToggle?: () => void }) {
  const email = user?.email || 'admin@crave.com'
  const name = user?.name || 'Admin'

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger button - visible on mobile only */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
        {user?.id && <NotificationBell userId={user.id} />}
        <div className="flex items-center gap-3 ml-2 border-l border-slate-200 dark:border-slate-700 pl-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-800">
            <img src={getUserAvatar(user)} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:flex flex-col items-start text-left">
            <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{name}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{email}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
