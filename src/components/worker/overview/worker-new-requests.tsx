"use client";

import { useState } from "react";
import { Calendar, User, Download, Loader2, X, FileText } from "lucide-react";
import { submitWorkerOffer } from "@/app/actions/worker";
import { useRouter } from "next/navigation";
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
      alert("Error: " + res.error);
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col h-full">
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white tracking-tight">
            {t("newRequests")}
          </h3>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
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
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px] pr-1">
            {requests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedReq(req)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.99] ${
                  selectedReq?.id === req.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-primary/40 hover:shadow-sm"
                }`}
              >
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 truncate">
                  {req.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                  <User className="w-3.5 h-3.5" /> {req.client.name}
                </div>
                {req.targetDeliveryDate && (
                  <div className="flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(req.targetDeliveryDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quote Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 md:p-8 max-w-lg w-full shadow-2xl relative flex flex-col">
            <button
              onClick={() => setSelectedReq(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-6 mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                {t("projectDetails")}
              </h3>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
                {selectedReq.title}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{t("client")}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedReq.client.name}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{t("deadline")}</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {selectedReq.targetDeliveryDate
                    ? new Date(selectedReq.targetDeliveryDate).toLocaleDateString()
                    : "Flexible"}
                </p>
              </div>
            </div>

            {selectedReq.description && (
              <div className="mb-5">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-4">
                  {selectedReq.description}
                </p>
              </div>
            )}

            {selectedReq.briefFileUrl && (
              <a
                href={selectedReq.briefFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 mb-5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium rounded-xl text-xs hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {t("downloadBrief")}
              </a>
            )}

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />

            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">{t("quoteTitle")}</h4>
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">{t("price")}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Rp</span>
                    <input
                      required
                      name="offeredPrice"
                      type="number"
                      min="0"
                      step="1000"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white"
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
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white"
                    placeholder="7"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/25 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                      Submitting...
                    </>
                  ) : (
                    t("submitQuote")
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
