"use client";

import { AlertCircle, Clock, ChevronRight, CheckCircle2, FileText, Send, X } from "lucide-react";
import { useState } from "react";
import { submitWorkerOffer } from "@/app/actions/worker";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export interface WorkerReminderItem {
  id: string;
  title: string;
  description: string;
  briefFileUrl: string | null;
  targetDeliveryDate: string | null;
  offeredPrice?: number | null;
  offeredDuration?: number | null;
  client: {
    name: string;
    email: string;
  };
}

export function WorkerReminders({ requests }: { requests: WorkerReminderItem[] }) {
  const t = useTranslations("WorkerDashboard");
  const [selectedReq, setSelectedReq] = useState<WorkerReminderItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (!requests || requests.length === 0) {
    return null;
  }

  async function handleQuoteSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedReq) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("projectId", selectedReq.id);

    const res = await submitWorkerOffer(formData);
    setIsSubmitting(false);

    if (res.success) {
      setSelectedReq(null);
      router.refresh();
    } else {
      toast.error("Error: " + res.error);
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Tindakan Diperlukan ({requests.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ada penawaran proyek yang perlu Anda tinjau dan beri harga/estimasi durasi
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => {
            const hasSubmittedOffer = Boolean(req.offeredPrice);

            return (
              <div
                key={req.id}
                className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                      <AlertCircle className="w-3.5 h-3.5" /> Worker Review
                    </span>
                    {req.targetDeliveryDate && (
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {new Date(req.targetDeliveryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mb-1 mt-2">
                    {req.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Klien: <strong className="text-slate-700 dark:text-slate-300">{req.client.name}</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
                  {hasSubmittedOffer ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t("offerSubmittedStatus")}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                      {t("offerNotSubmittedStatus")}
                    </span>
                  )}

                  <button
                    onClick={() => setSelectedReq(req)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>{hasSubmittedOffer ? t("editOfferBtn") : t("makeOfferBtn")}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quote Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 md:p-8 max-w-lg w-full shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedReq(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-6 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                <AlertCircle className="w-3.5 h-3.5" /> Worker Review
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mt-3">
                {selectedReq.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Klien: {selectedReq.client.name} ({selectedReq.client.email})
              </p>
            </div>

            {selectedReq.description && (
              <div className="mb-4 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Deskripsi Proyek</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedReq.description.replace(/<[^>]*>?/gm, "").trim()}
                </p>
              </div>
            )}

            {selectedReq.briefFileUrl && (
              <a
                href={selectedReq.briefFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 mb-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-xs hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer w-fit"
              >
                <FileText className="w-4 h-4" /> Unduh Dokumen Brief
              </a>
            )}

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

            <h4 className="text-sm font-bold text-slate-900 dark:text-white my-3">
              Isi Penawaran Harga & Estimasi Pekerjaan
            </h4>

            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Harga Penawaran (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">Rp</span>
                    <input
                      required
                      name="offeredPrice"
                      type="number"
                      min="0"
                      step="1000"
                      defaultValue={selectedReq.offeredPrice ? Number(selectedReq.offeredPrice) : ""}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      placeholder="5000000"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Durasi (Hari)</label>
                  <input
                    required
                    name="offeredDuration"
                    type="number"
                    min="1"
                    defaultValue={selectedReq.offeredDuration || ""}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    placeholder="7"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/25 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? "Kirim Penawaran..." : "Kirim Penawaran"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
