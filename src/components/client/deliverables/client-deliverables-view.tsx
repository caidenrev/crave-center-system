"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Package, Search } from "lucide-react";
import { approveClientDeliverable, requestClientDeliverableRevision } from "@/app/actions/client";
import { toast } from "sonner";
import { DeliverableItem } from "@/components/worker/deliverables/deliverable-types";
import { ClientDeliverableCard } from "./client-deliverable-card";
import { ClientRevisionModal } from "./client-revision-modal";

export function ClientDeliverablesView({
  deliverables,
}: {
  deliverables: DeliverableItem[];
}) {
  const t = useTranslations("ClientDeliverables");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Revision Modal State
  const [revisionItem, setRevisionItem] = useState<DeliverableItem | null>(null);

  const filteredDeliverables = deliverables.filter((item) => {
    const matchesFilter =
      filterStatus === "ALL" ||
      (filterStatus === "PENDING" && item.status === "PENDING_REVIEW") ||
      (filterStatus === "APPROVED" && item.status === "APPROVED") ||
      (filterStatus === "REVISION" && (item.status === "REVISED" || item.status === "REVISION_REQUESTED"));

    const matchesSearch =
      item.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.clientName && item.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleApprove = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await approveClientDeliverable(id);
      if (res.success) {
        toast.success("Deliverable berhasil disetujui!");
      } else {
        toast.error(res.error || "Gagal menyetujui deliverable");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRequestRevisionSubmit = async (e: React.FormEvent, feedback: string) => {
    if (!revisionItem) return;
    try {
      const res = await requestClientDeliverableRevision(revisionItem.id, feedback);
      if (res.success) {
        toast.success("Permintaan revisi berhasil dikirim ke worker");
        setRevisionItem(null);
      } else {
        toast.error(res.error || "Gagal mengirim permintaan revisi");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("title")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {t("subtitle")}
        </p>
      </div>

      {/* Controls Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          {[
            { id: "ALL", label: t("filterAll") },
            { id: "PENDING", label: t("filterPending") },
            { id: "APPROVED", label: t("filterApproved") },
            { id: "REVISION", label: t("filterRevision") },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === f.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deliverable List */}
      <div className="space-y-4">
        {filteredDeliverables.length > 0 ? (
          filteredDeliverables.map((item) => (
            <ClientDeliverableCard
              key={item.id}
              item={item}
              t={t}
              loadingId={loadingId}
              onApprove={handleApprove}
              onRequestRevision={setRevisionItem}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-xs">
            <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t("noDeliverables")}
            </h3>
          </div>
        )}
      </div>

      {/* Revision Request Modal */}
      {revisionItem && (
        <ClientRevisionModal
          item={revisionItem}
          t={t}
          onClose={() => setRevisionItem(null)}
          onSubmit={handleRequestRevisionSubmit}
        />
      )}
    </div>
  );
}
