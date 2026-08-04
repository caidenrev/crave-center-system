import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { createClient } from "@/utils/supabase/server"
import { ClientContractsView } from '@/components/client/contracts/client-contracts-view'

export default async function ClientContractsPage() {
  const t = await getTranslations('ClientContracts')
  
  await requireRole(["CLIENT"])
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const dbUser = user?.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null
  
  let contractList: any[] = []

  if (dbUser) {
    // Fetch all client projects with terms and contracts
    const projects = await prisma.project.findMany({
      where: {
        clientId: dbUser.id,
        status: { in: ['PENDING_DP', 'IN_PROGRESS', 'WORKER_REVIEW', 'IN_WARRANTY', 'COMPLETED'] }
      },
      include: {
        terms: true,
        contracts: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    contractList = projects.map(p => {
      const contract = p.contracts[0]
      const terms = p.terms
      const price = terms?.priceFinal
        ? Number(terms.priceFinal)
        : Number(p.offeredPrice || 0)

      return {
        id: contract?.id || `temp-contract-${p.id}`,
        projectId: p.id,
        contractDocumentUrl: contract?.contractDocumentUrl || `/api/pdf/terms/${p.id}`,
        signedAt: contract?.signedAt ? contract.signedAt.toISOString() : null,
        projectTitle: p.title,
        projectStatus: p.status,
        priceFinal: price,
        scope: terms?.scope || p.description,
        approvedByClient: terms?.approvedByClient || Boolean(contract?.signedAt)
      }
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
        <ClientContractsView contracts={contractList} />
      </div>
    </div>
  )
}
