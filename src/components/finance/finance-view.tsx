"use client"

import { DollarSign } from "lucide-react"

export interface IncomeItem {
  id: string
  projectId: string
  projectTitle: string
  amount: number
  type: string
  status: string // "SUCCESS" | "PENDING"
  date: string
}

export function FinanceView({ incomes, title = "Income Details" }: { incomes: IncomeItem[], title?: string }) {
  const hasIncomes = incomes && incomes.length > 0
  const displayIncomes = hasIncomes ? incomes : Array.from({ length: 4 }) // 4 empty rows if none

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 w-full overflow-hidden">
      <div className="p-6 md:p-8 space-y-6">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold uppercase text-slate-900 dark:text-white tracking-wider">{title}</h2>
          <div className="text-sm text-slate-400 font-medium">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-primary font-medium">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-1.5 hover:text-primary/80 transition-colors cursor-pointer">
              All records
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button className="flex items-center gap-1.5 hover:text-primary/80 transition-colors cursor-pointer">
              Last 30 days
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button className="hover:text-slate-900 dark:hover:text-white cursor-pointer">|&lt;</button>
            <button className="hover:text-slate-900 dark:hover:text-white cursor-pointer">&lt;</button>
            <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded">1/1</span>
            <button className="hover:text-slate-900 dark:hover:text-white cursor-pointer">&gt;</button>
            <button className="hover:text-slate-900 dark:hover:text-white cursor-pointer">&gt;|</button>
          </div>
        </div>

      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-t border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              <th className="py-4 px-6 md:px-8 whitespace-nowrap">Tanggal</th>
              <th className="py-4 px-4 whitespace-nowrap">Proyek</th>
              <th className="py-4 px-4 whitespace-nowrap">Keterangan</th>
              <th className="py-4 px-4 whitespace-nowrap">Jumlah (IDR)</th>
              <th className="py-4 px-6 md:px-8 text-right whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {displayIncomes.map((item: any, idx) => {
              const isDummy = !item?.id
              const isSuccess = !isDummy && (item.status === "SUCCESS" || item.status === "PAID" || item.status === "COMPLETED")

              return (
                <tr key={item?.id || `empty-${idx}`} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="py-4 px-6 md:px-8 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {isDummy ? <span className="opacity-0">Kosong</span> : new Date(item.date).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                      {isDummy ? "" : item.projectTitle}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {isDummy ? "" : (
                      <span className="inline-flex px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px]">
                        {item.type}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-slate-900 dark:text-slate-200 font-medium whitespace-nowrap">
                    {isDummy ? "" : `Rp ${Number(item.amount || 0).toLocaleString("id-ID")}`}
                  </td>
                  <td className="py-4 px-6 md:px-8 text-right">
                    {isDummy ? "" : (
                      <div className="flex items-center justify-end gap-3">
                        {isSuccess ? (
                          <span className="inline-flex px-3 py-1 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-medium text-[11px] tracking-wide">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-medium text-[11px] tracking-wide">
                            Pending
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        
        {!hasIncomes && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <DollarSign className="w-10 h-10 mb-4 opacity-50" />
            <p className="text-sm font-medium">Belum ada riwayat pemasukan</p>
          </div>
        )}
      </div>
    </div>
  )
}
