"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { uploadWorkerDeliverable } from "@/app/actions/worker";
import { DeliverableItem, ActiveProjectItem } from "./deliverable-types";
import { WorkerDeliverableCard } from "./worker-deliverable-card";
import { WorkerDeliverableDetailModal } from "./worker-deliverable-detail-modal";
import { WorkerUploadDeliverableModal } from "./worker-upload-deliverable-modal";

export function WorkerDeliverablesClient({
  deliverables,
  activeProjects = [],
}: {
  deliverables: DeliverableItem[];
  activeProjects?: ActiveProjectItem[];
}) {
  const t = useTranslations("WorkerDeliverables");
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<DeliverableItem | null>(null);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resubmitProjectId, setResubmitProjectId] = useState<string | null>(null);

  async function handleUpload(
    e: React.FormEvent<HTMLFormElement>,
    watermarkedFile: File | null,
    selectedFile: File | null,
    enableWatermark: boolean
  ) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    if (watermarkedFile || selectedFile) {
      formData.set("file", enableWatermark && watermarkedFile ? watermarkedFile : selectedFile!);
    }

    const res = await uploadWorkerDeliverable(formData);
    setIsSubmitting(false);

    if (res.success) {
      setShowUploadModal(false);
      setResubmitProjectId(null);
      router.refresh();
    } else {
      toast.error("Gagal mengunggah deliverable: " + res.error);
    }
  }

  const openResubmitModal = (item: DeliverableItem) => {
    setResubmitProjectId(item.projectId);
    setShowUploadModal(true);
    setSelectedItem(null);
  };

  const filteredDeliverables = deliverables.filter((item) => {
    const matchesSearch =
      item.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" ||
      item.status === statusFilter ||
      (statusFilter === "REVISION_REQUESTED" && item.status === "REVISED");

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
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

        <div className="flex items-center gap-3 justify-between md:justify-end">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: "ALL", label: t("filterAll") },
              { id: "PENDING_REVIEW", label: t("filterPending") },
              { id: "APPROVED", label: t("filterApproved") },
              { id: "REVISION_REQUESTED", label: t("filterRevision") },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === f.id
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setResubmitProjectId(null);
              setShowUploadModal(true);
            }}
            className="px-4 py-2.5 bg-primary text-white text-xs md:text-sm font-semibold rounded-2xl shadow-md shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" /> {t("uploadBtn")}
          </button>
        </div>
      </div>

      {/* Deliverables List */}
      <div className="space-y-4 pt-2">
        {filteredDeliverables.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-500">{t("noDeliverables")}</p>
          </div>
        ) : (
          filteredDeliverables.map((item) => (
            <WorkerDeliverableCard
              key={item.id}
              item={item}
              t={t}
              onSelect={setSelectedItem}
              onResubmit={openResubmitModal}
            />
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <WorkerDeliverableDetailModal
          item={selectedItem}
          t={t}
          onClose={() => setSelectedItem(null)}
          onResubmit={openResubmitModal}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <WorkerUploadDeliverableModal
          activeProjects={activeProjects}
          resubmitProjectId={resubmitProjectId}
          t={t}
          onClose={() => {
            setShowUploadModal(false);
            setResubmitProjectId(null);
          }}
          onSubmit={handleUpload}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
