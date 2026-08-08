"use client"

import { useState } from "react"
import { FileText, Download, CheckCircle2, Loader2, X, ShieldCheck, Clock, FileCheck, LayoutGrid, List } from "lucide-react"
import { acceptTermsByClient } from "@/app/actions/project"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

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
  hasOfficialContract?: boolean
}

export function ClientContractsView({ contracts }: { contracts: ContractItem[] }) {
  const t = useTranslations("ClientProjects")
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [selectedScope, setSelectedScope] = useState<{title: string, scope: string} | null>(null)
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "APPROVED">("ALL")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

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

  const filteredContracts = (contracts || []).filter((item) => {
    const isApproved = item.approvedByClient || Boolean(item.signedAt)
    if (filterStatus === "APPROVED") return isApproved
    if (filterStatus === "PENDING") return !isApproved && item.hasOfficialContract
    return true
  })

  const totalContracts = contracts?.length || 0
  const approvedCount = contracts?.filter(c => c.approvedByClient || c.signedAt).length || 0
  const pendingCount = contracts?.filter(c => !c.approvedByClient && !c.signedAt && c.hasOfficialContract).length || 0

  if (!contracts || contracts.length === 0) {
    return (
      <div className="p-12 text-center border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm">
        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">Belum Ada Kontrak Aktif</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Kontrak dan syarat resmi akan muncul di sini setelah Admin memproses dan menerbitkan dokumen penawaran proyek Anda.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Kontrak</span>
            <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalContracts}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Disetujui & Aktif</span>
            <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{approvedCount}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Menunggu Persetujuan</span>
            <h4 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{pendingCount}</h4>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Toolbar: Filter Pills & View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "Semua Kontrak" },
            { id: "PENDING", label: "Menunggu Persetujuan" },
            { id: "APPROVED", label: "Disetujui" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterStatus === f.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "table" ? "bg-white dark:bg-slate-700 text-primary shadow-xs" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid" ? "bg-white dark:bg-slate-700 text-primary shadow-xs" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Contracts View Display */}
      {viewMode === "table" ? (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs">
          <table className="w-full min-w-[750px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                <th className="py-4 px-6">Proyek</th>
                <th className="py-4 px-4">Scope Pekerjaan</th>
                <th className="py-4 px-4">Harga Final</th>
                <th className="py-4 px-4">Status Persetujuan</th>
                <th className="py-4 px-6 text-right">Aksi & Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredContracts.map((item) => {
                const isApproved = item.approvedByClient || Boolean(item.signedAt)
                const hasValidTerms = Boolean(item.hasOfficialContract && item.scope && Number(item.priceFinal) > 0)
                const pdfUrl = item.contractDocumentUrl || `/api/pdf/terms/${item.projectId}`

                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {item.projectTitle}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        ID: {item.projectId.substring(0, 8).toUpperCase()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {item.scope ? (
                        <button 
                          onClick={() => setSelectedScope({ title: item.projectTitle, scope: item.scope! })}
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-xl shadow-xs cursor-pointer w-fit"
                        >
                          <FileText className="w-3.5 h-3.5" /> Lihat Detail
                        </button>
                      ) : (
                        <span className="italic text-slate-400 text-xs">Belum ada</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-slate-900 dark:text-white text-sm whitespace-nowrap">
                      Rp {Number(item.priceFinal || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="py-4 px-4">
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
                        </span>
                      ) : hasValidTerms ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
                          Menunggu Persetujuan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                          Menunggu Dokumen
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {hasValidTerms ? (
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all cursor-pointer shadow-xs text-xs"
                            title="Buka Dokumen Kontrak PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Cetak</span>
                          </a>
                        ) : (
                          <button
                            disabled
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 font-bold opacity-60 cursor-not-allowed border border-slate-200/50 dark:border-slate-800 text-xs"
                            title="Dokumen kontrak belum diterbitkan oleh Admin/Worker"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Cetak</span>
                          </button>
                        )}

                        {!isApproved ? (
                          hasValidTerms ? (
                            <button
                              onClick={() => handleAcceptTerms(item.projectId)}
                              disabled={processingId === item.projectId}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50 text-xs"
                            >
                              {processingId === item.projectId ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                              <span>Setujui Terms</span>
                            </button>
                          ) : (
                            <button
                              disabled
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 font-bold opacity-60 cursor-not-allowed border border-slate-200/50 dark:border-slate-800 text-xs"
                              title="Dokumen kontrak belum siap disetujui"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Belum Tersedia</span>
                            </button>
                          )
                        ) : (
                          <span className="text-[11px] text-slate-400 italic flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Digital Signed
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredContracts.map((item) => {
            const isApproved = item.approvedByClient || Boolean(item.signedAt)
            const hasValidTerms = Boolean(item.hasOfficialContract && item.scope && Number(item.priceFinal) > 0)
            const pdfUrl = item.contractDocumentUrl || `/api/pdf/terms/${item.projectId}`

            return (
              <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                      ID: {item.projectId.substring(0, 8).toUpperCase()}
                    </span>
                    {isApproved ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
                      </span>
                    ) : hasValidTerms ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Menunggu Persetujuan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        Menunggu Dokumen
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-snug line-clamp-2 min-h-[3.5rem]">
                    {item.projectTitle}
                  </h4>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Harga Final:</span>
                    <strong className="text-slate-900 dark:text-white text-base font-black">
                      Rp {Number(item.priceFinal || 0).toLocaleString("id-ID")}
                    </strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  {item.scope ? (
                    <button 
                      onClick={() => setSelectedScope({ title: item.projectTitle, scope: item.scope! })}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Lihat Scope Pekerjaan
                    </button>
                  ) : (
                    <div className="py-2 text-center text-xs text-slate-400 italic">Scope belum diterbitkan</div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    {hasValidTerms ? (
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Cetak PDF
                      </a>
                    ) : (
                      <button disabled className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 font-bold text-xs opacity-60 cursor-not-allowed">
                        <Download className="w-3.5 h-3.5" /> Cetak PDF
                      </button>
                    )}

                    {!isApproved ? (
                      hasValidTerms ? (
                        <button
                          onClick={() => handleAcceptTerms(item.projectId)}
                          disabled={processingId === item.projectId}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          {processingId === item.projectId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>Setujui Terms</span>
                        </button>
                      ) : (
                        <button disabled className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 font-bold text-xs opacity-60 cursor-not-allowed">
                          Belum Tersedia
                        </button>
                      )
                    ) : (
                      <div className="flex-1 py-2 text-center text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Digital Signed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Scope Detail Modal */}
      {selectedScope && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedScope(null)}>
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-xl flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scope Pekerjaan & Kontrak</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{selectedScope.title}</p>
              </div>
              <button onClick={() => setSelectedScope(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors rounded-full shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {selectedScope.scope}
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-white dark:bg-slate-900">
              <button onClick={() => setSelectedScope(null)} className="px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-sm">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
