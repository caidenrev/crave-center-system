/**
 * Alert Component Examples
 * 
 * This file demonstrates various use cases for the Alert component
 * following the Crave ITSM design system.
 */

import { Alert, AlertTitle, AlertDescription, AlertFooter } from "./alert"
import { Terminal, Zap } from "lucide-react"

// ============================================================================
// EXAMPLE 1: Basic Alert Variants
// ============================================================================

export function BasicAlerts() {
  return (
    <div className="space-y-4">
      {/* Info Alert */}
      <Alert variant="info">
        <AlertTitle>Informasi Penting</AlertTitle>
        <AlertDescription>
          Project Anda sedang dalam tahap review. Tim kami akan segera menghubungi Anda.
        </AlertDescription>
      </Alert>

      {/* Success Alert */}
      <Alert variant="success">
        <AlertTitle>Pembayaran Berhasil!</AlertTitle>
        <AlertDescription>
          Pembayaran DP sebesar Rp 5.000.000 telah dikonfirmasi. Project akan segera dimulai.
        </AlertDescription>
      </Alert>

      {/* Warning Alert */}
      <Alert variant="warning">
        <AlertTitle>Proyek Dalam Tahap Review Worker</AlertTitle>
        <AlertDescription>
          Klien & Admin sedang menunggu estimasi harga dan waktu pengerjaan dari Anda.
          <br />
          <strong>Anda belum mengirimkan penawaran harga.</strong>
        </AlertDescription>
      </Alert>

      {/* Destructive Alert */}
      <Alert variant="destructive">
        <AlertTitle>Pembayaran Gagal</AlertTitle>
        <AlertDescription>
          Transaksi Anda tidak dapat diproses. Silakan periksa kembali metode pembayaran Anda.
        </AlertDescription>
      </Alert>
    </div>
  )
}

// ============================================================================
// EXAMPLE 2: Alert with Footer (Worker Review Use Case)
// ============================================================================

export function AlertWithFooter() {
  return (
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
  )
}

// ============================================================================
// EXAMPLE 3: Dismissible Alert
// ============================================================================

export function DismissibleAlert() {
  return (
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
  )
}

// ============================================================================
// EXAMPLE 4: Custom Icon Alert
// ============================================================================

export function CustomIconAlert() {
  return (
    <Alert variant="default" icon={<Terminal className="h-4 w-4 text-blue-500" />}>
      <AlertTitle>Developer Mode</AlertTitle>
      <AlertDescription>
        You are currently viewing the development environment. All data is for testing purposes only.
      </AlertDescription>
    </Alert>
  )
}

// ============================================================================
// EXAMPLE 5: Different Sizes
// ============================================================================

export function AlertSizes() {
  return (
    <div className="space-y-4">
      {/* Small */}
      <Alert variant="info" size="sm">
        <AlertTitle>Small Alert</AlertTitle>
        <AlertDescription>Compact alert for tight spaces.</AlertDescription>
      </Alert>

      {/* Default */}
      <Alert variant="success" size="default">
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>Standard size for most use cases.</AlertDescription>
      </Alert>

      {/* Large */}
      <Alert variant="warning" size="lg">
        <AlertTitle>Large Alert</AlertTitle>
        <AlertDescription>
          Prominent alert for important messages that need more visual weight.
        </AlertDescription>
      </Alert>
    </div>
  )
}

// ============================================================================
// EXAMPLE 6: No Icon Alert
// ============================================================================

export function NoIconAlert() {
  return (
    <Alert variant="default" icon={null}>
      <AlertTitle>Simple Message</AlertTitle>
      <AlertDescription>
        This alert has no icon, providing a cleaner look for simple notifications.
      </AlertDescription>
    </Alert>
  )
}

// ============================================================================
// EXAMPLE 7: Real-World Use Cases
// ============================================================================

export function RealWorldExamples() {
  return (
    <div className="space-y-6">
      {/* Client waiting for offer */}
      <Alert variant="warning">
        <AlertTitle>Menunggu Penawaran Worker</AlertTitle>
        <AlertDescription>
          Worker sedang mereview brief Anda dan akan mengirimkan penawaran harga dalam 1-2 hari kerja.
        </AlertDescription>
      </Alert>

      {/* Payment pending */}
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

      {/* Project on hold */}
      <Alert variant="destructive">
        <AlertTitle>Proyek Dalam Status On Hold</AlertTitle>
        <AlertDescription>
          Proyek Anda dihentikan sementara karena tidak ada respons selama 3 hari terakhir.
          Silakan hubungi tim untuk melanjutkan.
        </AlertDescription>
      </Alert>

      {/* Deliverable ready */}
      <Alert variant="success">
        <AlertTitle>Deliverable Siap Diunduh!</AlertTitle>
        <AlertDescription>
          Worker telah mengupload hasil pekerjaan. Anda dapat mengunduh file setelah menyelesaikan pembayaran penuh.
        </AlertDescription>
        <AlertFooter className="flex-col items-start gap-1">
          <span className="text-slate-500">Files:</span>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded text-xs font-mono">
              project_final.zip
            </span>
            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded text-xs font-mono">
              source_code.zip
            </span>
          </div>
        </AlertFooter>
      </Alert>

      {/* Warranty period */}
      <Alert variant="info" icon={<Zap className="h-4 w-4" />}>
        <AlertTitle>Dalam Masa Garansi</AlertTitle>
        <AlertDescription>
          Proyek Anda masih dalam periode garansi. Laporkan bug atau issue untuk perbaikan gratis.
        </AlertDescription>
        <AlertFooter>
          <span className="text-slate-500">Berakhir:</span>
          <strong className="text-slate-900 dark:text-white">
            15 Februari 2024
          </strong>
        </AlertFooter>
      </Alert>
    </div>
  )
}
