"use client";

import React from "react";
import { Calendar, Download, FileCode, RefreshCw } from "lucide-react";
import { DeliverableItem } from "./deliverable-types";
import { parseLinks, getStatusBadge, getFileIcon, getContentIndicators } from "./deliverable-helpers";

interface WorkerDeliverableCardProps {
  item: DeliverableItem;
  t: (key: string) => string;
  onSelect: (item: DeliverableItem) => void;
  onResubmit: (item: DeliverableItem) => void;
}

export function WorkerDeliverableCard({
  item,
  t,
  onSelect,
  onResubmit,
}: WorkerDeliverableCardProps) {
  const { mediaFileUrl, externalLink } = parseLinks(item.fileUrl, item.description);
  const indicators = getContentIndicators(item, t);
  const isRevisionRequested = item.status === "REVISED" || item.status === "REVISION_REQUESTED";

  // Clean description string by hiding embedded URL line if present
  const cleanDescription = item.description
    ? item.description.replace(/\n\nLink Repo \/ External: https?:\/\/[^\s]+/g, "").replace(/Link Repo \/ External: https?:\/\/[^\s]+/g, "").trim()
    : null;

  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-4"
    >
      {/* Top Section: Header & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 flex items-center justify-center shrink-0">
            {getFileIcon(item.fileUrl)}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug truncate">
              {item.projectTitle}
            </h4>
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              <span className="flex items-center gap-1" suppressHydrationWarning>
                <Calendar className="w-3.5 h-3.5" />
                {new Date(item.createdAt).toISOString().split("T")[0].split("-").reverse().join("/")}
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{item.clientName}</span>
              {indicators.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    {indicators.map((ind, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${ind.color}`}
                      >
                        {ind.icon} {ind.label}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          {getStatusBadge(item.status, t)}
        </div>
      </div>

      {/* Description Box if present */}
      {cleanDescription && (
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-bold block text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            {t("description")}:
          </span>
          <p className="whitespace-pre-line leading-relaxed line-clamp-3 md:line-clamp-none">
            {cleanDescription}
          </p>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex items-center justify-end gap-2 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {mediaFileUrl && (
          <a
            href={mediaFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> {t("viewFile")}
          </a>
        )}

        {externalLink && (
          <a
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-3.5 py-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20 dark:border-blue-500/30 hover:bg-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <FileCode className="w-3.5 h-3.5" /> {t("openRepo")}
          </a>
        )}

        {isRevisionRequested && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResubmit(item);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 dark:border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> {t("resubmit")}
          </button>
        )}
      </div>
    </div>
  );
}
