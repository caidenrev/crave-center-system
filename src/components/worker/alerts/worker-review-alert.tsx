"use client"

import { Alert, AlertTitle, AlertDescription, AlertFooter } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface WorkerReviewAlertProps {
  projectTitle?: string
  offeredPrice?: number | string
  offeredDuration?: number
  showOffer?: boolean
  className?: string
}

export function WorkerReviewAlert({
  projectTitle,
  offeredPrice,
  offeredDuration,
  showOffer = false,
  className,
}: WorkerReviewAlertProps) {
  const t = useTranslations("WorkerDashboard")

  return (
    <Alert className={cn("bg-amber-500 border-amber-600 text-white [&>svg]:text-white shadow-lg dark:bg-amber-600 dark:border-amber-700", className)}>
      <AlertTitle className="flex items-center gap-2 font-bold">
        {t("reviewStageTitle")}
      </AlertTitle>
      <AlertDescription>
        <p className="text-white/90">
          {t("reviewStageDesc")}
        </p>
        {showOffer && !offeredPrice && (
          <p className="mt-2 font-bold text-white bg-amber-600/50 dark:bg-amber-700/50 inline-block px-3 py-1.5 rounded-lg border border-amber-400/30">
            {t("noOfferYet")}
          </p>
        )}
      </AlertDescription>
      {showOffer && offeredPrice && offeredDuration && (
        <AlertFooter className="border-t border-white/20 mt-4 pt-3 text-white">
          <span className="text-white/80">{t("registeredOffer")}</span>
          <strong className="text-white font-black text-sm">
            Rp {Number(offeredPrice).toLocaleString("id-ID")} ({offeredDuration} {t("durationDaysLabel").toLowerCase().replace(/[()]/g, '')})
          </strong>
        </AlertFooter>
      )}
    </Alert>
  )
}
