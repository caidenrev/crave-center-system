'use client'

import { Bell, Search } from 'lucide-react'
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"

type UserProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function ClientTopbar({ user }: { user?: UserProps | null }) {
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US'
  const email = user?.email || 'client@example.com'
  const name = user?.name || 'User Client'

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <LanguageSwitcher />
        <ThemeToggle />
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 ml-2 border-l border-slate-200 dark:border-slate-700 pl-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
            {user?.image ? (
              <img src={user.image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary font-bold text-sm">{initials}</span>
            )}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{email}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
