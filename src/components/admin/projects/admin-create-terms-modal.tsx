"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, FileText, CheckCircle2, Loader2} from "lucide-react"
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

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
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 p-6 md:p-8"
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
                Lingkup Kerja & Ketentuan (Scope of Work) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Jelaskan fitur utama, teknologi, deliverable, dan garansi proyek..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 leading-relaxed"
                required
              />
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
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
