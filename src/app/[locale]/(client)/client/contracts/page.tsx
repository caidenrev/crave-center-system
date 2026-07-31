import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { createClient } from "@/utils/supabase/server"
import { FileText, Download } from 'lucide-react'

export default async function ClientContractsPage() {
  const t = await getTranslations('ClientContracts')
  
  await requireRole(["CLIENT"])
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const dbUser = user?.email ? await prisma.user.findUnique({ where: { email: user.email } }) : null
  
  let contracts: any[] = []

  if (dbUser) {
    contracts = await prisma.contract.findMany({
      where: { project: { clientId: dbUser.id } },
      include: { 
        project: true,
        terms: true
      },
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
        {contracts.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-500">{t('noContracts')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
                  <th className="pb-4 font-medium">Project</th>
                  <th className="pb-4 font-medium">Price</th>
                  <th className="pb-4 font-medium">Signed At</th>
                  <th className="pb-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map(contract => (
                  <tr key={contract.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{contract.project.title}</div>
                      <div className="text-xs text-slate-500 mt-1">Contract ID: {contract.id.split('-')[0]}</div>
                    </td>
                    <td className="py-4 font-medium text-slate-700 dark:text-slate-300">
                      Rp{Number(contract.terms.priceFinal).toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 text-slate-600 dark:text-slate-400">
                      {contract.signedAt ? new Date(contract.signedAt).toLocaleDateString() : 'Pending Signature'}
                    </td>
                    <td className="py-4 text-right">
                      {contract.contractDocumentUrl ? (
                        <a href={contract.contractDocumentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors">
                          <Download className="w-4 h-4" /> PDF
                        </a>
                      ) : (
                        <span className="text-xs text-amber-500 font-medium">Generating...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
