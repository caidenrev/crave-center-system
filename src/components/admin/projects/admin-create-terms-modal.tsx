"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, FileText, CheckCircle2, Loader2, Laptop, Palette, Video } from "lucide-react"
import { createAdminTermsAndContract } from "@/app/actions/project"
import { toast } from "sonner"

interface AdminCreateTermsModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectTitle: string
  currentPrice?: number
  currentScope?: string
  onSuccess?: () => void
}

export function AdminCreateTermsModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  currentPrice = 0,
  currentScope = "",
  onSuccess,
}: AdminCreateTermsModalProps) {
  const [priceFinal, setPriceFinal] = useState<number | string>(currentPrice || "")
  const [scope, setScope] = useState<string>(currentScope || "")
  const [warrantyDays, setWarrantyDays] = useState<number>(30)
  const [warrantyTerms, setWarrantyTerms] = useState<string>("Perbaikan bug/kendala teknis, penyesuaian minor, dan bantuan dukungan teknis.")
  const [selectedPreset, setSelectedPreset] = useState<string>("SOFTWARE")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleApplyPreset = (presetKey: string) => {
    setSelectedPreset(presetKey)
    switch (presetKey) {
      case "SOFTWARE":
        setWarrantyDays(30)
        setWarrantyTerms("Perbaikan bug, error sistem, optimasi performa, dan dukungan maintenance 30 hari pasca rilis.")
        break
      case "DESIGN":
        setWarrantyDays(7)
        setWarrantyTerms("Perbaikan minor layout, ekspor ulang format berkas (PNG/SVG/PDF), dan penyesuaian warna.")
        break
      case "VIDEO":
        setWarrantyDays(7)
        setWarrantyTerms("Re-render ulang resolusi, perbaikan audio sync, dan penyesuaian teks/subtitel minor.")
        break
      case "DOCUMENT":
        setWarrantyDays(14)
        setWarrantyTerms("Pemeriksaan ulang format dokumen, perbaikan ketik/tata letak, dan revisi pendukung.")
        break
      default:
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const numericPrice = Number(priceFinal)
    if (!numericPrice || numericPrice <= 0) {
      toast.error("Masukkan harga final yang valid")
      return
    }
    if (!scope.trim()) {
      toast.error("Masukkan lingkup kerja (scope of work)")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await createAdminTermsAndContract({
        projectId,
        priceFinal: numericPrice,
        scope: scope.trim(),
        warrantyDays: Number(warrantyDays) || 30,
        warrantyTerms: warrantyTerms.trim(),
      })

      if (res.success) {
        toast.success("Kontrak & Terms berhasil dibuat dan dikirim ke Client!")
        if (onSuccess) onSuccess()
        onClose()
      } else {
        toast.error(res.error || "Gagal membuat kontrak & terms")
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 p-6 md:p-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Buat Terms & Kontrak Resmi
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                  Proyek: {projectTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Harga Final Disepakati (IDR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Rp
                </span>
                <input
                  type="number"
                  value={priceFinal}
                  onChange={(e) => setPriceFinal(e.target.value)}
                  placeholder="Contoh: 15000000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Sistem akan otomatis menghitung <strong>DP 50%</strong> (Rp{" "}
                {priceFinal ? (Number(priceFinal) * 0.5).toLocaleString("id-ID") : "0"}) untuk tagihan Klien.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Lingkup Kerja (Scope of Work) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Jelaskan fitur utama, teknologi, dan deliverable pengerjaan..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 leading-relaxed"
                required
              />
            </div>

            {/* Warranty Selector */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Pilih Preset Garansi Proyek <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 mb-2.5">
                <button
                  type="button"
                  onClick={() => handleApplyPreset("SOFTWARE")}
                  className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer ${
                    selectedPreset === "SOFTWARE"
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <Laptop className="w-3.5 h-3.5 shrink-0" />
                    <span>Software & IT</span>
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">30 Hari Bug Fix</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset("DESIGN")}
                  className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer ${
                    selectedPreset === "DESIGN"
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <Palette className="w-3.5 h-3.5 shrink-0" />
                    <span>Desain & UI/UX</span>
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">7 Hari Revisi Minor</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset("VIDEO")}
                  className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer ${
                    selectedPreset === "VIDEO"
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <Video className="w-3.5 h-3.5 shrink-0" />
                    <span>Video & Audio</span>
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">7 Hari Re-render</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset("DOCUMENT")}
                  className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-all cursor-pointer ${
                    selectedPreset === "DOCUMENT"
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-[11px]">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>Dokumen & Lainnya</span>
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5">14 Hari Support</div>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="col-span-1">
                  <span className="block text-[11px] text-slate-500 mb-1 font-semibold">Masa (Hari):</span>
                  <input
                    type="number"
                    min={1}
                    value={warrantyDays}
                    onChange={(e) => setWarrantyDays(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <span className="block text-[11px] text-slate-500 mb-1 font-semibold">Syarat & Ketentuan Garansi:</span>
                  <input
                    type="text"
                    value={warrantyTerms}
                    onChange={(e) => setWarrantyTerms(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Proses...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Terbitkan & Kirim ke Client</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
