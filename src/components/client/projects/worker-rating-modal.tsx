'use client'

import { useState } from 'react'
import { Star, X, Loader2, Award } from 'lucide-react'
import { submitProjectRating } from '@/app/actions/client'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface WorkerRatingModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectTitle: string
  workerName?: string
  existingRating?: number | null
  existingFeedback?: string | null
  onSuccess?: () => void
}

export function WorkerRatingModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  workerName = 'Worker',
  existingRating,
  existingFeedback,
  onSuccess,
}: WorkerRatingModalProps) {
  const t = useTranslations("WorkerRating")
  const [rating, setRating] = useState<number>(existingRating || 5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>(existingFeedback || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating < 1 || rating > 5) {
      toast.error('Silakan pilih rating antara 1 sampai 5 bintang')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await submitProjectRating({
        projectId,
        rating,
        feedback,
      })

      if (res.success) {
        toast.success(t("successToast"))
        if (onSuccess) onSuccess()
        onClose()
      } else {
        toast.error(res.error || t("errorToast"))
      }
    } catch {
      toast.error('Terjadi kesalahan jaringan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-4 border border-amber-200 dark:border-amber-900/50 shadow-inner">
            <Award className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {t("modalTitle")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {t("ratePrompt", { workerName, projectTitle })}
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Interactive 5 Stars */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hoverRating || rating)
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-9 h-9 transition-colors ${
                        active
                          ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                          : 'text-slate-300 dark:text-slate-700 fill-slate-100 dark:fill-slate-800/50'
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {rating === 5 && t("rate5")}
              {rating === 4 && t("rate4")}
              {rating === 3 && t("rate3")}
              {rating === 2 && t("rate2")}
              {rating === 1 && t("rate1")}
            </div>

            <div className="text-left space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t("feedbackLabel")}
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={t("feedbackPlaceholder")}
                rows={3}
                className="w-full text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t("submit")
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
