"use client";

import { useState } from "react";
import { Calendar, User, Download, Loader2, X, FileText, ChevronRight, AlertCircle, Send } from "lucide-react";
import { submitWorkerOffer } from "@/app/actions/worker";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface RequestItem {
  id: string;
  title: string;
  description: string;
  briefFileUrl: string | null;
  targetDeliveryDate: string | null;
  client: {
    name: string;
    email: string;
  };
}

export function WorkerNewRequests({ requests }: { requests: RequestItem[] }) {
  const [selectedReq, setSelectedReq] = useState<RequestItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const t = useTranslations("WorkerDashboard");

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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col h-full">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {t("newRequests")}
          </h3>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-500 text-white shadow-xs border-none">
            {requests.length} New
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-400 dark:text-slate-500 py-8">
            <div className="text-center">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>{t("noRequests")}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {requests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className={`p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-2xs hover:shadow-md hover:-translate-y-0.5 ${
                  selectedReq?.id === req.id
                    ? "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md"
                    : "border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-2xs border-none">
                      <AlertCircle className="w-3 h-3" /> Worker Review
                    </span>
                    {req.targetDeliveryDate && (
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-500" />
                        {new Date(req.targetDeliveryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1 truncate">
                    {req.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Klien: <strong className="text-slate-700 dark:text-slate-300">{req.client.name}</strong>
                  </p>
                </div>

                <div className="flex items-center justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReq(req);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Beri Penawaran</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quote Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] p-6 md:p-8 max-w-lg w-full shadow-2xl relative flex flex-col max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setSelectedReq(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-8 mb-5">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs mb-2">
                <AlertCircle className="w-3.5 h-3.5" /> Worker Review
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {selectedReq.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Klien: {selectedReq.client.name} ({selectedReq.client.email})
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">{t("client")}</p>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">{selectedReq.client.name}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">{t("deadline")}</p>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {selectedReq.targetDeliveryDate
                    ? new Date(selectedReq.targetDeliveryDate).toLocaleDateString()
                    : "Flexible"}
                </p>
              </div>
            </div>

            {selectedReq.description && (
              <div className="mb-5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Deskripsi / Brief</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedReq.description.replace(/<[^>]*>?/gm, "").trim()}
                </p>
              </div>
            )}

            {selectedReq.briefFileUrl && (
              <a
                href={selectedReq.briefFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 mb-5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-xs hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer w-fit border border-blue-200 dark:border-blue-900/50"
              >
                <Download className="w-4 h-4" />
                {t("downloadBrief")}
              </a>
            )}

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white my-3">{t("quoteTitle")}</h4>
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">{t("price")}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">Rp</span>
                    <input
                      required
                      name="offeredPrice"
                      type="number"
                      min="0"
                      step="1000"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      placeholder="5000000"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">{t("duration")}</label>
                  <input
                    required
                    name="offeredDuration"
                    type="number"
                    min="1"
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
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{t("submitQuote")}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
