"use client"

import { Alert, AlertTitle, AlertDescription, AlertFooter } from "@/components/ui/alert"
import { WorkerReviewAlert } from "@/components/worker/alerts"
import {
  PaymentPendingAlert,
  PaymentSuccessAlert,
  PaymentFailedAlert,
  WaitingOfferAlert,
  ProjectOnHoldAlert,
  DeliverableReadyAlert,
  WarrantyPeriodAlert,
  ActionRequiredAlert,
} from "@/components/client/alerts"
import { Terminal, Zap } from "lucide-react"

export default function AlertsDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-foreground">
            Alert Components Demo
          </h1>
          <p className="text-muted-foreground">
            Demonstrasi lengkap komponen Alert untuk Crave ITSM
          </p>
        </div>

        {/* Basic Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b pb-2">
            Basic Variants
          </h2>
          
          <div className="space-y-4">
            <Alert variant="info">
              <AlertTitle>Informasi Penting</AlertTitle>
              <AlertDescription>
                Project Anda sedang dalam tahap review. Tim kami akan segera menghubungi Anda.
              </AlertDescription>
            </Alert>

            <Alert variant="success">
              <AlertTitle>Pembayaran Berhasil!</AlertTitle>
              <AlertDescription>
                Pembayaran DP sebesar Rp 5.000.000 telah dikonfirmasi. Project akan segera dimulai.
              </AlertDescription>
            </Alert>

            <Alert variant="warning">
              <AlertTitle>Perhatian</AlertTitle>
              <AlertDescription>
                Anda belum mengirimkan penawaran harga. Silakan segera submit penawaran Anda.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertTitle>Pembayaran Gagal</AlertTitle>
              <AlertDescription>
                Transaksi Anda tidak dapat diproses. Silakan periksa kembali metode pembayaran Anda.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Sizes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b pb-2">
            Different Sizes
          </h2>
          
          <div className="space-y-4">
            <Alert variant="info" size="sm">
              <AlertTitle>Small Alert</AlertTitle>
              <AlertDescription>Compact alert untuk tight spaces</AlertDescription>
            </Alert>

            <Alert variant="success" size="default">
              <AlertTitle>Default Alert</AlertTitle>
              <AlertDescription>Standard size untuk most use cases</AlertDescription>
            </Alert>

            <Alert variant="warning" size="lg">
              <AlertTitle>Large Alert</AlertTitle>
              <AlertDescription>
                Prominent alert untuk important messages yang membutuhkan visual weight lebih.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* With Footer */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b pb-2">
            Alert with Footer
          </h2>
          
          <Alert variant="warning">
            <AlertTitle>Proyek Dalam Tahap Review Worker</AlertTitle>
            <AlertDescription>
              Klien & Admin sedang menunggu estimasi harga dan waktu pengerjaan dari Anda.
            </AlertDescription>
            <AlertFooter>
              <span className="text-slate-500">Penawaran Terdaftar:</span>
              <strong className="text-slate-900 dark:text-white font-black">
                Rp 15.000.000 (30 hari)
              </strong>
            </AlertFooter>
          </Alert>

          <Alert variant="info">
            <AlertTitle>Menunggu Konfirmasi Pembayaran</AlertTitle>
            <AlertDescription>
              Kami sedang memverifikasi pembayaran Anda. Proses ini biasanya memakan waktu 1-24 jam.
            </AlertDescription>
            <AlertFooter>
              <span className="text-slate-500">ID Transaksi:</span>
              <strong className="text-slate-900 dark:text-white font-mono text-xs">
                TRX-2024-001234
              </strong>
            </AlertFooter>
          </Alert>
        </section>

        {/* Dismissible */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b pb-2">
            Dismissible Alerts
          </h2>
          
          <Alert 
            variant="info" 
            dismissible 
            onDismiss={() => console.log("Alert dismissed")}
          >
            <AlertTitle>Tips Penggunaan Platform</AlertTitle>
            <AlertDescription>
              Gunakan fitur chat untuk berkomunikasi langsung dengan client selama project berlangsung.
            </AlertDescription>
          </Alert>

          <Alert 
            variant="success" 
            dismissible
          >
            <AlertTitle>Feature Update</AlertTitle>
            <AlertDescription>
              Fitur notifikasi real-time telah diaktifkan untuk akun Anda.
            </AlertDescription>
          </Alert>
        </section>

        {/* Custom Icons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b pb-2">
            Custom Icons
          </h2>
          
          <Alert variant="default" icon={<Terminal className="h-4 w-4 text-blue-500" />}>
            <AlertTitle>Developer Mode</AlertTitle>
            <AlertDescription>
              You are currently viewing the development environment. All data is for testing purposes only.
            </AlertDescription>
          </Alert>

          <Alert variant="info" icon={<Zap className="h-4 w-4" />}>
            <AlertTitle>Fast Processing</AlertTitle>
            <AlertDescription>
              Your request is being processed with high priority.
            </AlertDescription>
          </Alert>

          <Alert variant="default" icon={null}>
            <AlertTitle>Simple Message</AlertTitle>
            <AlertDescription>
              This alert has no icon for a cleaner look.
            </AlertDescription>
          </Alert>
        </section>

        {/* Pre-built Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b pb-2">
            Pre-built Alert Components
          </h2>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Worker Alerts</h3>
            <WorkerReviewAlert 
              offeredPrice={15000000}
              offeredDuration={30}
              showOffer={true}
            />
            <WorkerReviewAlert 
              showOffer={true}
            />
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-foreground">Payment Alerts</h3>
            <PaymentPendingAlert 
              transactionId="TRX-2024-001234"
              amount={5000000}
            />
            <PaymentSuccessAlert 
              amount={5000000}
              type="DP"
              dismissible
            />
            <PaymentFailedAlert 
              reason="Saldo tidak mencukupi untuk menyelesaikan transaksi"
            />
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-foreground">Project Alerts</h3>
            <WaitingOfferAlert 
              workerName="John Doe"
              estimatedDays="2-3 hari kerja"
            />
            <ProjectOnHoldAlert />
            <DeliverableReadyAlert 
              files={["project_final.zip", "source_code.zip", "documentation.pdf"]}
            />
            <WarrantyPeriodAlert endDate="15 Februari 2024" />
            <ActionRequiredAlert 
              action="Approve penawaran worker"
              description="Review dan approve penawaran harga dari worker untuk melanjutkan project."
            />
          </div>
        </section>

        {/* Complex Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground border-b pb-2">
            Complex Alert Example
          </h2>
          
          <Alert variant="success">
            <AlertTitle>Deliverable Siap Diunduh!</AlertTitle>
            <AlertDescription>
              <p className="mb-3">
                Worker telah mengupload hasil pekerjaan. Anda dapat mengunduh file setelah menyelesaikan pembayaran penuh.
              </p>
              <div className="mt-3 pt-3 border-t border-emerald-200/50 dark:border-emerald-800/50">
                <span className="text-slate-500 dark:text-slate-400 text-xs block mb-2">
                  Files:
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded text-xs font-mono">
                    project_final_v2.zip
                  </span>
                  <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded text-xs font-mono">
                    source_code.zip
                  </span>
                  <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded text-xs font-mono">
                    documentation.pdf
                  </span>
                </div>
              </div>
            </AlertDescription>
            <AlertFooter>
              <span className="text-slate-500 dark:text-slate-400">Total Size:</span>
              <strong className="text-slate-900 dark:text-white">248.5 MB</strong>
            </AlertFooter>
          </Alert>
        </section>
      </div>
    </div>
  )
}
