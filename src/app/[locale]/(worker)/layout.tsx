import { ReactNode } from 'react'
import { WorkerSidebar } from '@/components/layout/worker-sidebar'
import { ClientTopbar } from '@/components/layout/client-topbar'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

import { createClient } from "@/utils/supabase/server"

export default async function WorkerLayout(props: {
  children: ReactNode,
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  const { children } = props
  await requireRole(["TEAM_MEMBER"])
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user?.email) return null

  // Ambil data user dari database agar bisa ditampilkan di Topbar
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })

  const topbarUser = {
    ...dbUser,
    name: dbUser?.name ?? user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
  }

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      <WorkerSidebar locale={locale} />
      <div className="flex-1 flex flex-col min-w-0">
        <ClientTopbar user={topbarUser} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
