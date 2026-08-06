"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Download } from "lucide-react"
import { useChatTranslations } from "../chat-i18n"

interface ChatImageModalProps {
  imageUrl: string | null
  fileName?: string | null
  onClose: () => void
}

export function ChatImageModal({ imageUrl, fileName, onClose }: ChatImageModalProps) {
  const { t } = useChatTranslations()
  if (!imageUrl) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 text-white">
            <span className="text-xs font-medium truncate max-w-xs text-slate-300">
              {fileName || t.imagePreview}
            </span>
            <div className="flex items-center gap-2">
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={fileName || "image"}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={t.download}
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={t.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Body */}
          <div className="p-2 overflow-auto flex items-center justify-center bg-slate-950 min-h-[200px]">
            <img
              src={imageUrl}
              alt={fileName || t.image}
              className="max-h-[80vh] w-auto object-contain rounded-lg"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
