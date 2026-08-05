'use client'

import { useState } from 'react'
import { Search, X, Menu } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
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

export function ClientTopbar({ user, onMenuToggle }: { user?: UserProps | null; onMenuToggle?: () => void }) {
  const email = user?.email || 'client@example.com'
  const name = user?.name || 'User Client'
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Extract locale from pathname (e.g., /en/client -> en)
      const locale = pathname.split('/')[1] || 'id'
      router.push(`/${locale}/client?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    const locale = pathname.split('/')[1] || 'id'
    router.push(`/${locale}/client`)
  }

  return (
    <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-9 pr-9 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-5">
        <LanguageSwitcher />
        <ThemeToggle />
        {user?.id && <NotificationBell userId={user.id} />}
        <button 
          onClick={() => router.push('/client/settings')}
          className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200 dark:border-slate-700 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-800">
            <img src={getUserAvatar(user)} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:flex flex-col items-start text-left">
            <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{email}</span>
          </div>
        </button>
      </div>
    </header>
  )
}
