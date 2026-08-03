import { ReactNode } from 'react'
import { WorkerLayoutShell } from '@/components/layout/worker-layout-shell'
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

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })

  const topbarUser = user
    ? {
        id: user.id,
        name:
          dbUser?.name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "Worker",
        email: user.email || "worker@crave.com",
        image:
          user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      }
    : null;

  return (
    <WorkerLayoutShell locale={locale} topbarUser={topbarUser}>
      {children}
    </WorkerLayoutShell>
  )
}
