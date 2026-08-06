"use client";

import React from "react";
import { X, Download, FileCode, ImageIcon, Link as LinkIcon, RefreshCw } from "lucide-react";
import { DeliverableItem } from "./deliverable-types";
import { parseLinks, getStatusBadge } from "./deliverable-helpers";

interface WorkerDeliverableDetailModalProps {
  item: DeliverableItem;
  t: (key: string) => string;
  onClose: () => void;
  onResubmit: (item: DeliverableItem) => void;
}

export function WorkerDeliverableDetailModal({
  item,
  t,
  onClose,
  onResubmit,
}: WorkerDeliverableDetailModalProps) {
  const { mediaFileUrl, externalLink } = parseLinks(item.fileUrl, item.description);
  const isRevisionRequested = item.status === "REVISED" || item.status === "REVISION_REQUESTED";

  const cleanDescription = item.description
    ? item.description.replace(/\n\nLink Repo \/ External: https?:\/\/[^\s]+/g, "").replace(/Link Repo \/ External: https?:\/\/[^\s]+/g, "").trim()
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 md:p-8 max-w-lg w-full shadow-2xl relative flex flex-col gap-5 border border-slate-200 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="pr-6">
          <div className="mb-2.5">{getStatusBadge(item.status, t)}</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {item.projectTitle}
          </h3>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {t("client")}: <strong className="text-slate-700 dark:text-slate-300">{item.clientName}</strong>
          </p>
        </div>

        {/* Description Section */}
        {cleanDescription && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              {t("description")}
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {cleanDescription}
            </p>
          </div>
        )}

        {/* File / Link Tautan Section */}
        {(mediaFileUrl || externalLink) && (
          <div className="flex flex-col gap-3.5">
            {mediaFileUrl && (
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {t("viewFile")}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400" suppressHydrationWarning>
                      {t("uploadedOn")}{" "}
                      {new Date(item.createdAt).toISOString().split("T")[0].split("-").reverse().join("/")}
                    </p>
                  </div>
                </div>
                <a
                  href={mediaFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-500/20 dark:border-indigo-500/30 hover:bg-indigo-500/20 transition-colors shadow-xs shrink-0"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            )}

            {externalLink && (
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <LinkIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {t("openRepo")}
                    </p>
                    <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 truncate">
                      {externalLink}
                    </p>
                  </div>
                </div>
                <a
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20 dark:border-blue-500/30 hover:bg-blue-500/20 transition-colors shrink-0"
                >
                  <FileCode className="w-5 h-5" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Footer Section */}
        <div className="flex justify-end gap-2.5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
          {isRevisionRequested && (
            <button
              onClick={() => onResubmit(item)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
            >
              <RefreshCw className="w-4 h-4" /> {t("resubmit")}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}
