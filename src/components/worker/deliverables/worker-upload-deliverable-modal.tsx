"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  X,
  Link as LinkIcon,
  ImageIcon,
  FileCode,
  Video,
  FileText,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { applyWatermarkToImage } from "@/lib/watermark-utils";
import { ActiveProjectItem } from "./deliverable-types";

interface WorkerUploadDeliverableModalProps {
  activeProjects: ActiveProjectItem[];
  resubmitProjectId: string | null;
  t: (key: string) => string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>, watermarkedFile: File | null, selectedFile: File | null, enableWatermark: boolean) => Promise<void>;
  isSubmitting: boolean;
}

export function WorkerUploadDeliverableModal({
  activeProjects,
  resubmitProjectId,
  t,
  onClose,
  onSubmit,
  isSubmitting,
}: WorkerUploadDeliverableModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadMode, setUploadMode] = useState<"FILE" | "URL">("FILE");
  const [projectCategory, setProjectCategory] = useState<"SOFTWARE" | "DESIGN" | "VIDEO" | "DOCUMENT">("DESIGN");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [watermarkedFile, setWatermarkedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessingWatermark, setIsProcessingWatermark] = useState(false);
  const [enableWatermark, setEnableWatermark] = useState(true);
  const [watermarkText, setWatermarkText] = useState("CRAVE CENTER - PREVIEW ONLY");
  const [fileUrlInput, setFileUrlInput] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!selectedFile) {
      queueMicrotask(() => {
        if (isMounted) {
          setPreviewUrl(null);
          setWatermarkedFile(null);
        }
      });
      return;
    }

    const isImage = selectedFile.type.startsWith("image/");
    if (!isImage) {
      queueMicrotask(() => {
        if (isMounted) {
          setPreviewUrl(null);
          setWatermarkedFile(null);
        }
      });
      return;
    }

    if (!enableWatermark) {
      const objectUrl = URL.createObjectURL(selectedFile);
      queueMicrotask(() => {
        if (isMounted) {
          setPreviewUrl(objectUrl);
          setWatermarkedFile(selectedFile);
        }
      });
      return;
    }

    queueMicrotask(() => {
      if (isMounted) {
        setIsProcessingWatermark(true);
      }
    });

    applyWatermarkToImage(selectedFile, { text: watermarkText })
      .then(({ file, dataUrl }) => {
        if (isMounted) {
          setWatermarkedFile(file);
          setPreviewUrl(dataUrl);
          setIsProcessingWatermark(false);
        }
      })
      .catch((err) => {
        console.error("Gagal apply watermark:", err);
        if (isMounted) {
          setPreviewUrl(URL.createObjectURL(selectedFile));
          setWatermarkedFile(selectedFile);
          setIsProcessingWatermark(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedFile, enableWatermark, watermarkText]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      setProjectCategory("DESIGN");
    } else if (file.type.startsWith("video/")) {
      setProjectCategory("VIDEO");
    } else {
      setProjectCategory("DOCUMENT");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto border border-slate-200/80 dark:border-slate-800 custom-scrollbar">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {t("uploadModalTitle")}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t("uploadModalSubtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => onSubmit(e, watermarkedFile, selectedFile, enableWatermark)} className="mt-5 space-y-5">
          {/* Select Project */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t("targetProject")} <span className="text-red-500">*</span>
            </label>
            <select
              name="projectId"
              required
              defaultValue={resubmitProjectId || ""}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="">{t("selectActiveProject")}</option>
              {activeProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            {activeProjects.length === 0 && (
              <p className="text-[11px] text-amber-500 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {t("noActiveProjects")}
              </p>
            )}
          </div>

          {/* Delivery Method Toggle */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t("deliveryMethod")} <span className="text-red-500">*</span>
            </label>
            <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl gap-1.5 border border-slate-200/50 dark:border-slate-700/50">
              <button
                type="button"
                onClick={() => setUploadMode("FILE")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  uploadMode === "FILE"
                    ? "bg-white dark:bg-slate-900 text-primary shadow-xs border border-slate-200/60 dark:border-slate-700/60"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Upload className="w-4 h-4" /> {t("uploadFileDirect")}
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("URL")}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  uploadMode === "URL"
                    ? "bg-white dark:bg-slate-900 text-primary shadow-xs border border-slate-200/60 dark:border-slate-700/60"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <LinkIcon className="w-4 h-4" /> {t("linkRepo")}
              </button>
            </div>
          </div>

          {/* Category Preset Badges */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {t("deliverableCategory")}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setProjectCategory("DESIGN")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  projectCategory === "DESIGN"
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                }`}
              >
                <ImageIcon className="w-4 h-4 shrink-0" />
                <span>{t("designUI")}</span>
              </button>
              <button
                type="button"
                onClick={() => setProjectCategory("SOFTWARE")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  projectCategory === "SOFTWARE"
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-4 h-4 shrink-0" />
                <span>{t("softwareIT")}</span>
              </button>
              <button
                type="button"
                onClick={() => setProjectCategory("VIDEO")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  projectCategory === "VIDEO"
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                }`}
              >
                <Video className="w-4 h-4 shrink-0" />
                <span>{t("video")}</span>
              </button>
              <button
                type="button"
                onClick={() => setProjectCategory("DOCUMENT")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  projectCategory === "DOCUMENT"
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>{t("document")}</span>
              </button>
            </div>
          </div>

          {/* Mode FILE Upload Zone */}
          {uploadMode === "FILE" ? (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary/60 dark:hover:border-primary/60 rounded-2xl p-6 text-center bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                {selectedFile ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 inline-flex items-center gap-3 max-w-full text-left shadow-xs">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {t("clickToChange")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {t("dragDrop")} <span className="text-primary font-extrabold underline decoration-2 underline-offset-2">{t("selectFile")}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">
                      {t("supportedFormats")}
                    </p>
                  </div>
                )}
              </div>

              {/* Watermark Section */}
              {selectedFile && selectedFile.type.startsWith("image/") && (
                <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableWatermark}
                        onChange={(e) => setEnableWatermark(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                      />
                      <span>{t("enableWatermark")}</span>
                    </label>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-md">
                      {t("watermarkRecommended")}
                    </span>
                  </div>

                  {enableWatermark && (
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {t("watermarkText")}
                      </span>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  {previewUrl && (
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-primary" /> {t("previewBefore")}
                        </span>
                        {isProcessingWatermark && (
                          <span className="flex items-center gap-1 text-amber-500 animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" /> {t("processingWatermark")}
                          </span>
                        )}
                      </div>
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900/80 max-h-44 flex items-center justify-center p-2">
                        <img
                          src={previewUrl}
                          alt="Watermark Preview"
                          className="max-h-40 w-auto object-contain rounded-lg shadow-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Mode URL Input */
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t("deliverableLinkLabel")} <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="fileUrl"
                required={uploadMode === "URL"}
                value={fileUrlInput}
                onChange={(e) => setFileUrlInput(e.target.value)}
                placeholder="https://github.com/user/repo, Figma link, Frame.io, atau Google Drive..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* Optional GitHub / Repository Link Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t("repoUrlLabel")} <span className="text-slate-400 font-normal">({t("optional")})</span>
            </label>
            <input
              type="url"
              name="repoUrl"
              placeholder="https://github.com/username/repository-name..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t("notesLabel")}
            </label>
            <textarea
              name="description"
              rows={2}
              placeholder={t("notesPlaceholder")}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || activeProjects.length === 0 || (uploadMode === "FILE" && !selectedFile && !fileUrlInput)}
              className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> {t("uploading")}
                </>
              ) : (
                t("submit")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
