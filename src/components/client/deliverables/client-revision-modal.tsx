"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { DeliverableItem } from "@/components/worker/deliverables/deliverable-types";

interface ClientRevisionModalProps {
  item: DeliverableItem;
  t: (key: string) => string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent, feedback: string) => Promise<void>;
}

export function ClientRevisionModal({
  t,
  onClose,
  onSubmit,
}: ClientRevisionModalProps) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(e, feedback);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
          {t("revisionModalTitle")}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t("revisionModalDesc")}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={t("revisionPlaceholder")}
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {t("submitRevision")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
