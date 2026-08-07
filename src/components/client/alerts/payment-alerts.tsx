"use client"

import { Alert, AlertTitle, AlertDescription, AlertFooter } from "@/components/ui/alert"

interface PaymentPendingAlertProps {
  transactionId?: string
  amount?: number
  className?: string
}

export function PaymentPendingAlert({
  transactionId,
  amount,
  className,
}: PaymentPendingAlertProps) {
  return (
    <Alert variant="info" className={className}>
      <AlertTitle>Menunggu Konfirmasi Pembayaran</AlertTitle>
      <AlertDescription>
        <p>
          Kami sedang memverifikasi pembayaran Anda. Proses ini biasanya memakan waktu 1-24 jam.
        </p>
      </AlertDescription>
      {transactionId && (
        <AlertFooter>
          <span className="text-slate-500 dark:text-slate-400">ID Transaksi:</span>
          <strong className="text-slate-900 dark:text-white font-mono text-xs">
            {transactionId}
          </strong>
        </AlertFooter>
      )}
    </Alert>
  )
}

interface PaymentSuccessAlertProps {
  amount: number
  type?: "DP" | "FULL_PAYMENT" | "PELUNASAN" | "MILESTONE"
  className?: string
  dismissible?: boolean
  onDismiss?: () => void
}

export function PaymentSuccessAlert({
  amount,
  type = "DP",
  className,
  dismissible,
  onDismiss,
}: PaymentSuccessAlertProps) {
  const typeText = {
    DP: "DP",
    FULL_PAYMENT: "pembayaran penuh",
    PELUNASAN: "pelunasan",
    MILESTONE: "milestone",
  }

  return (
    <Alert 
      variant="success" 
      className={className} 
      dismissible={dismissible}
      onDismiss={onDismiss}
    >
      <AlertTitle>Pembayaran Berhasil!</AlertTitle>
      <AlertDescription>
        <p>
          Pembayaran {typeText[type]} sebesar <strong>Rp {amount.toLocaleString("id-ID")}</strong> telah dikonfirmasi. 
          {type === "DP" && " Project akan segera dimulai."}
          {type === "PELUNASAN" && " Anda sekarang dapat mengunduh deliverable."}
        </p>
      </AlertDescription>
    </Alert>
  )
}

interface PaymentFailedAlertProps {
  reason?: string
  className?: string
}

export function PaymentFailedAlert({
  reason,
  className,
}: PaymentFailedAlertProps) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertTitle>Pembayaran Gagal</AlertTitle>
      <AlertDescription>
        <p>
          {reason || "Transaksi Anda tidak dapat diproses. Silakan periksa kembali metode pembayaran Anda."}
        </p>
      </AlertDescription>
    </Alert>
  )
}
