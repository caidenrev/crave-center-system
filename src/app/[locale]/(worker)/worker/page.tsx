import { requireRole } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getTranslations } from "next-intl/server"
import { WorkerDashboardClient } from "./worker-dashboard-client"

import { createClient } from "@/utils/supabase/server"

export default async function WorkerDashboardPage() {
  await requireRole(["TEAM_MEMBER"])
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user?.email) return null

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })
  
  if (!dbUser) return null
  
  const requests = await prisma.project.findMany({
    where: { 
      workerId: dbUser.id,
      status: "REQUESTED"
    },
    include: {
      client: true
    },
    orderBy: { targetDeliveryDate: 'asc' }
  })
  
  const t = await getTranslations("WorkerDashboard")
  const dict = {
    title: t('title'),
    subtitle: t('subtitle'),
    newRequests: t('newRequests'),
    noRequests: t('noRequests'),
    respondBtn: t('respondBtn'),
    projectDetails: t('projectDetails'),
    client: t('client'),
    deadline: t('deadline'),
    downloadBrief: t('downloadBrief'),
    quoteTitle: t('quoteTitle'),
    price: t('price'),
    duration: t('duration'),
    submitQuote: t('submitQuote')
  }

  // Serialize to avoid passing Date objects or complex Prisma types to client component
  const serializedRequests = requests.map((r: any) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    briefFileUrl: r.briefFileUrl,
    targetDeliveryDate: r.targetDeliveryDate ? r.targetDeliveryDate.toISOString() : null,
    client: {
      name: r.client.name,
      email: r.client.email
    }
  }))

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{dict.title}</h1>
        <p className="text-slate-500">{dict.subtitle}</p>
      </div>
      
      <WorkerDashboardClient requests={serializedRequests} t={dict} />
    </div>
  )
}
