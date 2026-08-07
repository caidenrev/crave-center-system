"use client";

import { useState } from "react";
import { FileText, Download, CheckCircle2, X, Search, Clock, ShieldCheck } from "lucide-react";

export interface WorkerContractItem {
  id: string;
  projectId: string;
  projectTitle: string;
  projectStatus: string;
  clientName: string;
  clientEmail?: string;
  priceFinal: number;
  scope?: string | null;
  approvedByClient?: boolean;
  signedAt?: string | null;
  contractDocumentUrl?: string | null;
}

export function WorkerContractsView({ contracts }: { contracts: WorkerContractItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScope, setSelectedScope] = useState<{ title: string; scope: string } | null>(null);

  const filteredContracts = (contracts || []).filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.projectTitle.toLowerCase().includes(query) ||
      item.clientName.toLowerCase().includes(query) ||
      item.projectId.toLowerCase().includes(query)
    );
  });

  if (!contracts || contracts.length === 0) {
    return (
      <div className="p-12 text-center border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <FileText className="w-7 h-7" />
        </div>
        <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Belum Ada Kontrak Aktif</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Dokumen syarat & kontrak (Terms) proyek Anda akan muncul di sini setelah Admin memproses dan menyusun penawaran resmi.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama proyek atau klien..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          Total: {filteredContracts.length} Kontrak
        </span>
      </div>

      {/* Contracts Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 uppercase text-slate-500 dark:text-slate-400 font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4">Proyek & Klien</th>
                <th className="px-6 py-4">Scope Pekerjaan</th>
                <th className="px-6 py-4">Harga Final</th>
                <th className="px-6 py-4">Persetujuan Klien</th>
                <th className="px-6 py-4 text-right">Dokumen PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {filteredContracts.map((item) => {
                const isApproved = item.approvedByClient || Boolean(item.signedAt);
                const pdfUrl = item.contractDocumentUrl || `/api/pdf/terms/${item.projectId}`;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                        {item.projectTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Klien: <strong className="text-slate-700 dark:text-slate-300">{item.clientName}</strong>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.scope ? (
                        <button
                          onClick={() => setSelectedScope({ title: item.projectTitle, scope: item.scope! })}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" /> Lihat Scope
                        </button>
                      ) : (
                        <span className="italic text-slate-400">Belum diatur</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-900 dark:text-white text-sm whitespace-nowrap">
                      Rp {Number(item.priceFinal || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui Klien
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                          <Clock className="w-3.5 h-3.5" /> Menunggu Persetujuan
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Dokumen PDF</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scope Detail Modal */}
      {selectedScope && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedScope(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Scope Pekerjaan</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedScope.title}</p>
              </div>
              <button
                onClick={() => setSelectedScope(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {selectedScope.scope}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-white dark:bg-slate-900">
              <button
                onClick={() => setSelectedScope(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
