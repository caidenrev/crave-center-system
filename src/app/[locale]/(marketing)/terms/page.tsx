"use client"

import { motion } from "framer-motion"

export default function TermsPage() {
  return (
    <div className="relative overflow-hidden flex flex-col items-center pt-32 pb-24 min-h-screen">
      <div className="w-full max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Syarat & <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Ketentuan</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Terakhir diperbarui: 1 Agustus 2026
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-8 text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">1. Ketentuan Umum</h2>
              <p>
                Dengan mengakses atau menggunakan platform Crave ITSM, Anda menyatakan setuju untuk terikat oleh Syarat & Ketentuan ini. Jika Anda tidak menyetujui salah satu bagian dari ketentuan ini, Anda tidak diperkenankan menggunakan layanan kami.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">2. Layanan Platform</h2>
              <p>
                Crave ITSM menyediakan platform manajemen proyek IT B2B yang menghubungkan klien dengan tim pengembang ahli. Fitur utama mencakup pembuatan request proyek, negosiasi syarat & ruang lingkup kerja (Terms), pelacakan kemajuan, dan penyerahan aset final.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">3. Akun & Keamanan</h2>
              <p>
                Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun dan kata sandi Anda. Semua aktivitas yang terjadi di bawah akun Anda menjadi tanggung jawab Anda sepenuhnya.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">4. Pemesanan Proyek & Pembayaran</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Penawaran & Kesepakatan:</strong> Proyek akan dimulai setelah penawaran harga (quote) disetujui oleh kedua belah pihak.</li>
                <li><strong>Uang Muka (DP):</strong> Pengerjaan proyek dimulai setelah pembayaran DP awal berhasil diverifikasi.</li>
                <li><strong>Pelunasan & Serah Terima:</strong> Source code, kredensial, dan aset utama proyek akan diserahkan secara otomatis setelah pelunasan tagihan akhir diterima.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">5. Hak Kekayaan Intelektual</h2>
              <p>
                Setelah pelunasan proyek selesai secara penuh, seluruh Hak Kekayaan Intelektual atas hasil karya yang dikembangkan khusus untuk proyek tersebut beralih kepada Klien, sesuai dengan ruang lingkup yang tercantum dalam dokumen persetujuan proyek.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">6. Batasan Tanggung Jawab</h2>
              <p>
                Crave ITSM tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan kami di luar batas tanggung jawab yang telah disepakati dalam kontrak resmi proyek.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">7. Perubahan Ketentuan</h2>
              <p>
                Kami berhak untuk mengubah atau memperbarui Syarat & Ketentuan ini sewaktu-waktu. Perubahan akan berlaku segera setelah diunggah di platform ini.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
