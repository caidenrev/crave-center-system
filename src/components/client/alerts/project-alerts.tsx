"use client"

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface WaitingOfferAlertProps {
  workerName?: string
  estimatedDays?: string
  className?: string
}

export function WaitingOfferAlert({
  workerName,
  estimatedDays = "1-2 hari kerja",
  className,
}: WaitingOfferAlertProps) {
  return (
    <Alert variant="warning" className={className}>
      <AlertTitle>Menunggu Penawaran Worker</AlertTitle>
      <AlertDescription>
        <p>
          {workerName ? `${workerName} sedang` : "Worker sedang"} mereview brief Anda dan akan mengirimkan penawaran harga dalam {estimatedDays}.
        </p>
      </AlertDescription>
    </Alert>
  )
}

interface ProjectOnHoldAlertProps {
  reason?: string
  className?: string
}

export function ProjectOnHoldAlert({
  reason,
  className,
}: ProjectOnHoldAlertProps) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertTitle>Proyek Dalam Status On Hold</AlertTitle>
      <AlertDescription>
        <p>
          {reason || "Proyek Anda dihentikan sementara karena tidak ada respons selama 3 hari terakhir. Silakan hubungi tim untuk melanjutkan."}
        </p>
      </AlertDescription>
    </Alert>
  )
}

interface DeliverableReadyAlertProps {
  files?: string[]
  className?: string
}

export function DeliverableReadyAlert({
  files,
  className,
}: DeliverableReadyAlertProps) {
  return (
    <Alert variant="success" className={className}>
      <AlertTitle>Deliverable Siap Diunduh!</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          Worker telah mengupload hasil pekerjaan. Anda dapat mengunduh file setelah menyelesaikan pembayaran penuh.
        </p>
        {files && files.length > 0 && (
          <div className="mt-3 pt-3 border-t border-emerald-200/50 dark:border-emerald-800/50">
            <span className="text-slate-500 dark:text-slate-400 text-xs block mb-2">Files:</span>
            <div className="flex flex-wrap gap-2">
              {files.map((file, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded text-xs font-mono"
                >
                  {file}
                </span>
              ))}
            </div>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}

interface WarrantyPeriodAlertProps {
  endDate: string
  className?: string
}

export function WarrantyPeriodAlert({
  endDate,
  className,
}: WarrantyPeriodAlertProps) {
  return (
    <Alert variant="info" className={className}>
      <AlertTitle>Dalam Masa Garansi</AlertTitle>
      <AlertDescription>
        <p>
          Proyek Anda masih dalam periode garansi. Laporkan bug atau issue untuk perbaikan gratis.
        </p>
        <div className="mt-3 pt-3 border-t border-blue-200/50 dark:border-blue-800/50 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Berakhir:</span>
          <strong className="text-slate-900 dark:text-white">{endDate}</strong>
        </div>
      </AlertDescription>
    </Alert>
  )
}

interface ActionRequiredAlertProps {
  action: string
  description?: string
  className?: string
}

export function ActionRequiredAlert({
  action,
  description,
  className,
}: ActionRequiredAlertProps) {
  return (
    <Alert variant="warning" className={className}>
      <AlertTitle>Tindakan Diperlukan</AlertTitle>
      <AlertDescription>
        <p>
          <strong>{action}</strong>
        </p>
        {description && <p className="mt-1 text-slate-600 dark:text-slate-400">{description}</p>}
      </AlertDescription>
    </Alert>
  )
}
