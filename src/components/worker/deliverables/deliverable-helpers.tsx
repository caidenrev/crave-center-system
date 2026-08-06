import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ImageIcon,
  Video,
  FileCode,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import { DeliverableItem } from "./deliverable-types";

/** Detect whether the fileUrl is a media (supabase storage) file or an external link */
export function parseLinks(fileUrl: string, description: string | null) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const descMatches = description ? description.match(urlRegex) : null;

  const isStorageFile = fileUrl && (
    fileUrl.includes("supabase.co/storage") ||
    fileUrl.includes("/storage/v1/object/")
  );

  const mediaFileUrl: string | null = isStorageFile ? fileUrl : null;
  let externalLink: string | null = !isStorageFile ? fileUrl : null;

  if (descMatches && descMatches.length > 0) {
    for (const match of descMatches) {
      if (
        match.includes("github.com") ||
        match.includes("figma.com") ||
        match.includes("drive.google.com") ||
        match.includes("gitlab.com") ||
        match.includes("bitbucket.org")
      ) {
        if (!externalLink) externalLink = match;
        break;
      }
    }
    if (!externalLink && descMatches.length > 0) {
      externalLink = descMatches[0];
    }
  }

  return { mediaFileUrl, externalLink };
}

/** Get status badge element */
export function getStatusBadge(status: string, t: (key: string) => string) {
  switch (status) {
    case "APPROVED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" /> {t("statusApproved")}
        </span>
      );
    case "REVISED":
    case "REVISION_REQUESTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <AlertCircle className="w-3.5 h-3.5" /> {t("statusRevision")}
        </span>
      );
    case "PENDING_REVIEW":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <Clock className="w-3.5 h-3.5" /> {t("statusPending")}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {status}
        </span>
      );
  }
}

/** Get file icon component based on URL extensions */
export function getFileIcon(url: string) {
  if (!url) return <FileText className="w-5 h-5 text-primary" />;
  if (url.includes(".png") || url.includes(".jpg") || url.includes(".webp")) {
    return <ImageIcon className="w-5 h-5 text-indigo-500" />;
  }
  if (url.includes(".mp4") || url.includes("frame.io")) {
    return <Video className="w-5 h-5 text-purple-500" />;
  }
  if (url.includes("github.com") || url.includes(".zip")) {
    return <FileCode className="w-5 h-5 text-blue-500" />;
  }
  return <FileText className="w-5 h-5 text-emerald-500" />;
}

/** Get content-type indicators (File, Link) */
export function getContentIndicators(item: DeliverableItem, t: (key: string) => string) {
  const { mediaFileUrl, externalLink } = parseLinks(item.fileUrl, item.description);
  const indicators: { icon: React.ReactNode; label: string; color: string }[] = [];

  if (mediaFileUrl) {
    indicators.push({
      icon: <ImageIcon className="w-3 h-3" />,
      label: t("hasFile"),
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200/80 dark:border-indigo-800/60",
    });
  }
  if (externalLink) {
    indicators.push({
      icon: <LinkIcon className="w-3 h-3" />,
      label: t("hasLink"),
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200/80 dark:border-blue-800/60",
    });
  }

  return indicators;
}
