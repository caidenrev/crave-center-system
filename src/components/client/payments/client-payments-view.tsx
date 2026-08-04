"use client"

import { useState } from "react"
import { DollarSign, CheckCircle2, CreditCard, Loader2 } from "lucide-react"
import { payDPByClient } from "@/app/actions/project"
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
      const res = await payDPByClient(paymentId)
      if (res.success) {
        toast.success("Pembayaran DP berhasil dikonfirmasi! Proyek resmi dimulai.")
      } else {
        toast.error(res.error || "Gagal melakukan konfirmasi pembayaran")
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan")
    } finally {
      setProcessingId(null)
    }
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
        <DollarSign className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">Belum Ada Tagihan Pembayaran</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Riwayat tagihan DP dan pelunasan proyek Anda akan otomatis tampil di sini setelah kontrak diterbitkan.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="pb-4 font-semibold">Tanggal</th>
              <th className="pb-4 font-semibold">Proyek</th>
              <th className="pb-4 font-semibold">Tipe Tagihan</th>
              <th className="pb-4 font-semibold">Jumlah (IDR)</th>
              <th className="pb-4 font-semibold text-right">Status & Pembayaran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {payments.map((item) => {
              const isSuccess = item.status === "SUCCESS" || item.status === "PAID"

              return (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 pr-4 text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.projectTitle}
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[11px]">
                      {item.type === "DP" ? "Down Payment (DP 50%)" : "Pelunasan Final"}
                    </span>
                  </td>
                  <td className="py-4 pr-4 font-extrabold text-slate-900 dark:text-white text-sm">
                    Rp {Number(item.amount || 0).toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isSuccess ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Lunas
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePayDP(item.id)}
                          disabled={processingId === item.id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                        >
                          {processingId === item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CreditCard className="w-3.5 h-3.5" />
                          )}
                          <span>Bayar DP Sekarang</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
