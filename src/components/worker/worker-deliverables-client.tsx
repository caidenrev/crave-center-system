"use client";

import { useState } from "react";
import {
  Search,
  X,
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface DeliverableItem {
  id: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  fileUrl: string;
  description: string | null;
  status: string;
  createdAt: string;
}

export function WorkerDeliverablesClient({
  deliverables,
}: {
  deliverables: DeliverableItem[];
}) {
  const t = useTranslations("WorkerDashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<DeliverableItem | null>(
    null
  );

  const filteredDeliverables = deliverables.filter((d) => {
    const matchesSearch =
      d.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description &&
        d.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Menunggu Review
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
          </span>
        );
      case "REVISION_REQUESTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Perlu Revisi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <>
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari deliverable..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: "ALL", label: "Semua" },
            { id: "PENDING_REVIEW", label: "Menunggu Review" },
            { id: "APPROVED", label: "Disetujui" },
            { id: "REVISION_REQUESTED", label: "Perlu Revisi" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === f.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deliverables List */}
      <div className="space-y-3">
        {filteredDeliverables.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500">Belum ada deliverable.</p>
          </div>
        ) : (
          filteredDeliverables.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                      {item.projectTitle}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {item.description || "Tidak ada deskripsi"}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{item.clientName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  {getStatusBadge(item.status)}
                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 md:p-8 max-w-lg w-full shadow-2xl relative flex flex-col">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-6 mb-6">
              <div className="mb-3">{getStatusBadge(selectedItem.status)}</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {selectedItem.projectTitle}
              </h3>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
                Klien: {selectedItem.clientName}
              </p>
            </div>

            <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Deskripsi
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {selectedItem.description || "Tidak ada deskripsi disediakan."}
              </p>
            </div>

            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    File Lampiran
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Diunggah pada{" "}
                    {new Date(selectedItem.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <a
                href={selectedItem.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white dark:bg-slate-900 rounded-xl text-primary border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors shadow-sm"
              >
                <Download className="w-5 h-5" />
              </a>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
