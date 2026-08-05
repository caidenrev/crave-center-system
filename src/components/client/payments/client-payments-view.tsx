"use client"

import { useState } from "react"
import Script from "next/script"
import { DollarSign, CheckCircle2, CreditCard, Loader2 } from "lucide-react"
import { createMidtransTransaction } from "@/app/actions/project"
import { toast } from "sonner"

interface PaymentItem {
  id: string
  projectId: string
  projectTitle: string
  amount: number
  type: string
  status: string
  paidAt?: string | null
  createdAt: string
}

export function ClientPaymentsView({ payments }: { payments: PaymentItem[] }) {
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handlePayDP = async (paymentId: string) => {
    setProcessingId(paymentId)
    try {
      const res = await createMidtransTransaction(paymentId)
      if (res.success && res.token) {
        // @ts-ignore
        if (window.snap) {
          // @ts-ignore
          window.snap.pay(res.token, {
            onSuccess: function (result: any) {
              toast.success("Pembayaran berhasil diproses!")
              // Optionally trigger a revalidation or status update
              window.location.reload()
            },
            onPending: function (result: any) {
              toast.info("Menunggu pembayaran Anda.")
            },
            onError: function (result: any) {
              toast.error("Pembayaran gagal. Silakan coba lagi.")
            },
            onClose: function () {
              toast.info("Anda menutup popup sebelum menyelesaikan pembayaran.")
            }
          })
        } else {
          toast.error("Gagal memuat sistem pembayaran (Midtrans Snap).")
        }
      } else {
        toast.error(res.error || "Gagal mendapatkan token pembayaran")
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan")
    } finally {
      setProcessingId(null)
    }
  }

  const hasPayments = payments && payments.length > 0
  const displayPayments = hasPayments ? payments : Array.from({ length: 4 }) // 4 empty rows if none

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 w-full overflow-hidden">
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />
      <div className="p-6 md:p-8 space-y-6">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold uppercase text-slate-900 dark:text-white tracking-wider">Payments</h2>
          <div className="text-sm text-slate-400 font-medium">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-primary font-medium">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-1.5 hover:text-primary/80 transition-colors">
              All payments
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button className="flex items-center gap-1.5 hover:text-primary/80 transition-colors">
              Last 30 days
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <button className="flex items-center gap-1.5 hover:text-primary/80 transition-colors hidden md:flex">
              All methods
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button className="hover:text-slate-900 dark:hover:text-white">|&lt;</button>
            <button className="hover:text-slate-900 dark:hover:text-white">&lt;</button>
            <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded">1/1</span>
            <button className="hover:text-slate-900 dark:hover:text-white">&gt;</button>
            <button className="hover:text-slate-900 dark:hover:text-white">&gt;|</button>
          </div>
        </div>

      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-t border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              <th className="py-4 px-6 md:px-8 whitespace-nowrap">Tanggal</th>
              <th className="py-4 px-4 whitespace-nowrap">Proyek</th>
              <th className="py-4 px-4 whitespace-nowrap">Tipe Tagihan</th>
              <th className="py-4 px-4 whitespace-nowrap">Jumlah (IDR)</th>
              <th className="py-4 px-6 md:px-8 text-right whitespace-nowrap">Status & Pembayaran</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {displayPayments.map((item: any, idx) => {
              const isDummy = !item?.id
              const isSuccess = !isDummy && (item.status === "SUCCESS" || item.status === "PAID")

              return (
                <tr key={item?.id || `empty-${idx}`} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="py-4 px-6 md:px-8 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {isDummy ? <span className="opacity-0">Kosong</span> : new Date(item.createdAt).toLocaleDateString("id-ID", {
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
                        {item.type === "DP" ? "Down Payment" : "Pelunasan"}
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
                          <>
                            <span className="inline-flex px-3 py-1 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-medium text-[11px] tracking-wide">
                              Outstanding
                            </span>
                            <button
                              onClick={() => handlePayDP(item.id)}
                              disabled={processingId === item.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {processingId === item.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CreditCard className="w-3.5 h-3.5" />
                              )}
                              <span>Bayar</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {!hasPayments && (
        <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm border-t border-slate-200 dark:border-slate-800 bg-transparent">
          Belum ada riwayat transaksi
        </div>
      )}
    </div>
  )
}
