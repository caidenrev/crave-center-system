"use client"

import { useState } from "react"
import { FileText, Download, CheckCircle2, Loader2} from "lucide-react"
import { acceptTermsByClient } from "@/app/actions/project"
import { toast } from "sonner"

interface ContractItem {
  id: string
  projectId: string
  contractDocumentUrl?: string | null
  signedAt?: string | null
  projectTitle: string
  projectStatus: string
  priceFinal: number
  scope?: string | null
  approvedByClient?: boolean
}

export function ClientContractsView({ contracts }: { contracts: ContractItem[] }) {
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleAcceptTerms = async (projectId: string) => {
    setProcessingId(projectId)
    try {
      const res = await acceptTermsByClient(projectId)
      if (res.success) {
        toast.success("Terms & Kontrak berhasil disetujui!")
      } else {
        toast.error(res.error || "Gagal menyetujui terms")
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan")
    } finally {
      setProcessingId(null)
    }
  }

  if (!contracts || contracts.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">Belum Ada Kontrak Aktif</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Kontrak dan syarat resmi akan muncul di sini setelah Admin memproses dan menerbitkan dokumen penawaran proyek Anda.
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
              <th className="pb-4 font-semibold">Proyek</th>
              <th className="pb-4 font-semibold">Harga Final</th>
              <th className="pb-4 font-semibold">Status Persetujuan</th>
              <th className="pb-4 font-semibold text-right">Aksi & Dokumen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {contracts.map((item) => {
              const isApproved = item.approvedByClient || Boolean(item.signedAt)
              const pdfUrl = item.contractDocumentUrl || `/api/pdf/terms/${item.projectId}`

              return (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.projectTitle}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      ID: {item.projectId.substring(0, 8).toUpperCase()}
                    </div>
                  </td>
                  <td className="py-4 pr-4 font-extrabold text-slate-900 dark:text-white text-sm">
                    Rp {Number(item.priceFinal || 0).toLocaleString("id-ID")}
                  </td>
                  <td className="py-4 pr-4">
                    {isApproved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Menunggu Persetujuan
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* View / Download PDF Button */}
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all cursor-pointer"
                        title="Buka Dokumen Kontrak PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Cetak / PDF</span>
                      </a>

                      {/* Accept Terms Button */}
                      {!isApproved ? (
                        <button
                          onClick={() => handleAcceptTerms(item.projectId)}
                          disabled={processingId === item.projectId}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
                        >
                          {processingId === item.projectId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          <span>Setujui Terms</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Tandatangan Digital Aktif
                        </span>
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
