"use client"

import { motion } from "framer-motion"

export default function PrivacyPage() {
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
              Kebijakan <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Privasi</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Terakhir diperbarui: 1 Agustus 2026
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-8 text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">1. Pendahuluan</h2>
              <p>
                Selamat datang di Crave ITSM. Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi yang Anda bagikan kepada kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda saat menggunakan platform Crave ITSM.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">2. Informasi yang Kami Kumpulkan</h2>
              <p>Kami mengumpulkan beberapa jenis informasi untuk memberikan dan meningkatkan layanan kami:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Informasi Akun:</strong> Nama, alamat email, nomor telepon, dan informasi profil saat Anda mendaftar.</li>
                <li><strong>Informasi Proyek:</strong> Brief proyek, dokumen persyaratan, komunikasi dalam platform, dan data transaksi.</li>
                <li><strong>Informasi Teknis:</strong> Alamat IP, jenis peramban, log aktivitas, dan data cookies untuk keperluan analisis dan keamanan.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">3. Penggunaan Informasi</h2>
              <p>Informasi yang kami kumpulkan digunakan untuk:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Memproses pesanan proyek IT dan memfasilitasi komunikasi antara klien dan tim ahli.</li>
                <li>Mengelola kontrak, milestone, dan proses pelunasan secara otomatis dan aman.</li>
                <li>Meningkatkan kualitas platform, keamanan sistem, dan pengalaman pengguna.</li>
                <li>Mengirimkan pemberitahuan penting terkait status proyek atau pembaruan layanan.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">4. Perlindungan & Keamanan Data</h2>
              <p>
                Kami menerapkan standar keamanan teknis dan organisasi yang ketat, termasuk enkripsi data dalam perjalanan (in-transit) dan saat disimpan (at-rest). Akses ke data proyek Anda dibatasi hanya kepada pihak-pihak yang berwenang.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">5. Pembagian Informasi Kepada Pihak Ketiga</h2>
              <p>
                Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Data hanya dapat dibagikan kepada penyedia layanan pihak ketiga yang tepercaya (misalnya penyedia gateway pembayaran atau penyimpanan cloud) semata-mata untuk menjalankan fungsi operasional platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">6. Hak-Hak Anda</h2>
              <p> Anda berhak untuk mengakses, memperbarui, atau meminta penghapusan data pribadi Anda yang tersimpan di sistem kami. Jika Anda ingin melaksanakan hak ini, silakan hubungi tim dukungan kami melalui halaman Hubungi Kami. </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">7. Kontak Kami</h2>
              <p>
                Jika Anda memiliki pertanyaan atau kekhawatiran terkait Kebijakan Privasi ini, silakan hubungi kami di <strong>support@crave.id</strong>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
