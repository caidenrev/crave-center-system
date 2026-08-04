import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { createClient } from "@/utils/supabase/server"
import { ClientPaymentsView } from '@/components/client/payments/client-payments-view'

export default async function ClientPaymentsPage() {
  const t = await getTranslations('ClientPayments')
  
  await requireRole(["CLIENT"])
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const dbUser = user?.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null
  
  let paymentList: any[] = []

  if (dbUser) {
    // Query payments for user's projects
    const rawPayments = await prisma.payment.findMany({
      where: { project: { clientId: dbUser.id } },
      include: { project: true },
      orderBy: { createdAt: 'desc' }
    })

    // Also check for projects in PENDING_DP that might not have a Payment record created yet
    const pendingDpProjects = await prisma.project.findMany({
      where: {
        clientId: dbUser.id,
        status: 'PENDING_DP',
        payments: { none: {} }
      },
      include: { terms: true }
    })

    const fallbackPayments = pendingDpProjects.map(p => {
      const price = p.terms?.priceFinal ? Number(p.terms.priceFinal) : Number(p.offeredPrice || 0)
      return {
        id: `temp-payment-${p.id}`,
        projectId: p.id,
        projectTitle: p.title,
        amount: price * 0.5,
        type: 'DP',
        status: 'PENDING',
        createdAt: p.createdAt.toISOString()
      }
    })

    paymentList = [
      ...rawPayments.map(p => ({
        id: p.id,
        projectId: p.projectId,
        projectTitle: p.project.title,
        amount: Number(p.amount),
        type: p.type,
        status: p.status,
        paidAt: p.paidAt ? p.paidAt.toISOString() : null,
        createdAt: p.createdAt.toISOString()
      })),
      ...fallbackPayments
    ]
  }
  
  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('subtitle')}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <ClientPaymentsView payments={paymentList} />
      </div>
    </div>
  )
}
