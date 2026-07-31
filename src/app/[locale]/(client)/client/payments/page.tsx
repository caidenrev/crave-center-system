import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { createClient } from "@/utils/supabase/server"
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export default async function ClientPaymentsPage() {
  const t = await getTranslations('ClientPayments')
  
  await requireRole(["CLIENT"])
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const dbUser = user?.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null
  
  let payments: any[] = []

  if (dbUser) {
    payments = await prisma.payment.findMany({
      where: { project: { clientId: dbUser.id } },
      include: { project: true },
      orderBy: { createdAt: 'desc' }
    })
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
        {payments.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-500">{t('noPayments')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Project</th>
                  <th className="pb-4 font-medium">Type</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => {
                  let StatusIcon = Clock
                  let statusColor = "text-amber-500 bg-amber-50 dark:bg-amber-500/10"
                  
                  if (payment.status === 'SUCCESS') {
                    StatusIcon = CheckCircle2
                    statusColor = "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                  } else if (payment.status === 'FAILED') {
                    StatusIcon = AlertCircle
                    statusColor = "text-red-500 bg-red-50 dark:bg-red-500/10"
                  }
                  
                  return (
                    <tr key={payment.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 text-slate-600 dark:text-slate-400 text-sm">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{payment.project.title}</div>
                      </td>
                      <td className="py-4">
                        <div className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg inline-block">
                          {payment.type}
                        </div>
                      </td>
                      <td className="py-4 font-medium text-slate-900 dark:text-white">
                        Rp{Number(payment.amount).toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 text-right flex justify-end">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {payment.status}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
