"use client"

import { useState } from "react"
import Script from "next/script"
import { CreditCard, Loader2, DollarSign, Wallet, Clock, CheckCircle2 } from "lucide-react"
import { createMidtransTransaction } from "@/app/actions/project"
import { toast } from "sonner"
import { useTranslations, useLocale } from "next-intl"

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
  const t = useTranslations("ClientPayments")
  const locale = useLocale()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PAID" | "OUTSTANDING">("ALL")

  const handlePayDP = async (paymentId: string) => {
    setProcessingId(paymentId)
    try {
      const res = await createMidtransTransaction(paymentId)
      if (res.success && res.token) {
        // @ts-expect-error - Midtrans Snap is loaded globally from external script
        if (window.snap) {
          // @ts-expect-error - Midtrans Snap is loaded globally from external script
          window.snap.pay(res.token, {
            onSuccess: function () {
              toast.success("Pembayaran berhasil diproses!")
              window.location.reload()
            },
            onPending: function () {
              toast.info("Menunggu pembayaran Anda.")
            },
            onError: function () {
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

  // Calculated dynamic statistics
  const totalPaid = payments
    .filter(p => p.status === "SUCCESS" || p.status === "PAID")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)

  const totalOutstanding = payments
    .filter(p => p.status !== "SUCCESS" && p.status !== "PAID")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)

  const totalCount = payments.length

  // Filter payments
  const filteredPayments = payments.filter(p => {
    const isSuccess = p.status === "SUCCESS" || p.status === "PAID"
    if (filterStatus === "PAID") return isSuccess
    if (filterStatus === "OUTSTANDING") return !isSuccess
    return true
  })

  const hasPayments = filteredPayments && filteredPayments.length > 0

  return (
    <div className="space-y-6">
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />

      {/* Dynamic Summary Cards / Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-xl shadow-emerald-900/20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">{t("totalPaid")}</span>
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Rp {totalPaid.toLocaleString("id-ID")}
              </h3>
              <p className="text-xs text-emerald-200 mt-1">{t("totalPaidSub")}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-6 shadow-xl shadow-amber-900/20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">{t("totalOutstanding")}</span>
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Rp {totalOutstanding.toLocaleString("id-ID")}
              </h3>
              <p className="text-xs text-amber-200 mt-1">{t("totalOutstandingSub")}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-xl shadow-blue-900/20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">{t("totalTransactions")}</span>
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {totalCount} <span className="text-base font-normal text-blue-200">{t("invoicesUnit")}</span>
              </h3>
              <p className="text-xs text-blue-200 mt-1">{t("totalTransactionsSub")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 w-full overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {t("headerTitleFull")}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t("headerDesc")}
              </p>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full" suppressHydrationWarning>
              {new Date().toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { month: "long", year: "numeric" })}
            </div>
          </div>

          {/* Interactive Filters row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-semibold border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl">
              <button 
                onClick={() => setFilterStatus("ALL")}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${filterStatus === "ALL" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
              >
                {t("allPayments")} ({payments.length})
              </button>
              <button 
                onClick={() => setFilterStatus("OUTSTANDING")}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${filterStatus === "OUTSTANDING" ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
              >
                {t("outstanding")} ({payments.filter(p => p.status !== "SUCCESS" && p.status !== "PAID").length})
              </button>
              <button 
                onClick={() => setFilterStatus("PAID")}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${filterStatus === "PAID" ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}
              >
                {t("completed")} ({payments.filter(p => p.status === "SUCCESS" || p.status === "PAID").length})
              </button>
            </div>
          </div>

        </div>

        {hasPayments ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-t border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6 md:px-8 whitespace-nowrap">{t("colDate")}</th>
                  <th className="py-4 px-4 whitespace-nowrap">{t("colProject")}</th>
                  <th className="py-4 px-4 whitespace-nowrap">{t("colBillingType")}</th>
                  <th className="py-4 px-4 whitespace-nowrap">{t("colAmount")}</th>
                  <th className="py-4 px-6 md:px-8 text-right whitespace-nowrap">{t("colStatus")}</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredPayments.map((item) => {
                  const isSuccess = item.status === "SUCCESS" || item.status === "PAID"

                  return (
                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="py-4 px-6 md:px-8 text-slate-500 dark:text-slate-400 whitespace-nowrap" suppressHydrationWarning>
                        {new Date(item.createdAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                          {item.projectTitle}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                          {item.type === "DP" ? t("typeDP") : t("typeFull")}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-900 dark:text-slate-200 font-bold whitespace-nowrap">
                        Rp {Number(item.amount || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-6 md:px-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {isSuccess ? (
                            <span className="inline-flex px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] tracking-wide">
                              {t("completed")}
                            </span>
                          ) : (
                            <>
                              <span className="inline-flex px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-[11px] tracking-wide">
                                {t("outstanding")}
                              </span>
                              <button
                                onClick={() => handlePayDP(item.id)}
                                disabled={processingId === item.id}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-primary/20"
                              >
                                {processingId === item.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CreditCard className="w-3.5 h-3.5" />
                                )}
                                <span>{t("payBtn")}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <DollarSign className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">{t("emptyHistory")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
