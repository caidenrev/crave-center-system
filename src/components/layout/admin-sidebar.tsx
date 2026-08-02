'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LayoutDashboard, Users, CheckSquare, Settings, LogOut, ShieldAlert, FolderKanban } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConfirmModal } from '@/components/ui/confirm-modal'

export function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname()
  const router = useRouter()
  // We can reuse ClientSidebar translations for common things like "Settings", "Logout", but we'll hardcode admin ones for simplicity
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const navItems = [
    {
      title: 'Admin Panel',
      items: [
        { name: 'Overview', href: `/${locale}/admin`, icon: LayoutDashboard },
        { name: 'Job Requests', href: `/${locale}/admin/requests`, icon: CheckSquare },
        { name: 'Projects', href: `/${locale}/admin/projects`, icon: FolderKanban },
        { name: 'Team Workload', href: `/${locale}/admin/team`, icon: Users },
        { name: 'Worker Applications', href: `/${locale}/admin/applications`, icon: ShieldAlert },
      ]
    },
    {
      title: 'General',
      items: [
        { name: 'Settings', href: `/${locale}/admin/settings`, icon: Settings },
        { name: 'Logout', href: `/${locale}/auth/logout`, icon: LogOut, isLogout: true },
      ]
    }
  ]

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false)
    router.push(`/${locale}/auth/logout`)
  }

  return (
    <>
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 hidden md:flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href={`/${locale}/admin`} className="flex items-center group">
            <img src="/light-mode-logo.png" alt="Crave" className="h-7 w-auto dark:hidden transition-transform group-hover:scale-105" />
            <img src="/dark-mode-logo.png" alt="Crave" className="h-7 w-auto hidden dark:block transition-transform group-hover:scale-105" />
            <span className="font-bold text-xl ml-2 text-slate-900 dark:text-white">Admin</span>
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
                  if (item.isLogout) {
                    return (
                      <button
                        key={item.name}
                        onClick={() => setShowLogoutModal(true)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left cursor-pointer",
                          "text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                        )}
                      >
                        <item.icon className="w-5 h-5 text-red-500 dark:text-red-400" />
                        {item.name}
                      </button>
                    )
                  }

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
      </aside>

      <ConfirmModal
        open={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Sign Out"
        description="Are you sure you want to sign out from your admin account?"
        confirmText="Sign Out"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  )
}
