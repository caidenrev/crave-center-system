# Dokumentasi Pembaruan Fitur & Panduan Pengujian Crave ITSM 🚀
**Tanggal:** 6 Agustus 2026  
**Branch Git:** `feature/admin-dashboard-updates`  
**Status:** Siap Pengujian & Handover Tim Developer

---

## 📋 Executive Summary
Hari ini telah dilakukan pembaruan besar-besaran pada platform **Crave ITSM**, mencakup perombakan UI Keuangan, integrasi sistem pembayaran otomatis (Midtrans), obrolan mengapung (*Floating Chat Widget*), proteksi karya (*Deliverables Watermarking*), modul pengiriman email (Resend), pembuatan PDF Terms, serta pembersihan dan restrukturisasi komponen agar lebih modular dan aman (*edge-case safety*).

Dokumen ini disusun sebagai panduan lengkap mengenai **apa saja yang sudah diperbarui**, **apa saja yang belum/perlu diteruskan**, serta **panduan pengujian (testing)** untuk tim penanggung jawab selanjutnya.

---

## 📑 1. Ringkasan Update Yang Telah Selesai (Completed Features)

### 📊 1.1 Perombakan Tampilan Keuangan (Finance Dashboard)
- **Tampilan Grid Modern:** Menghapus kotak kecil lama dan menggantinya dengan **Stat Cards** responsif untuk Admin dan Pekerja (*Worker*).
- **Full-Width Hero Card:** Kartu "Total Pendapatan Utama" membentang penuh (*full-width*) dengan rincian pendapatan bulanan dan proyek aktif.
- **Akses Cepat Sidebar:** Navigasi Keuangan telah disematkan langsung di *Sidebar* Admin & Worker dengan ikon **Wallet** (Dompet) agar mempermudah navigasi.

### 💳 1.2 Integrasi Payment Gateway (Midtrans Snap & Webhook)
- **Midtrans Snap Popup:** Mengganti pembayaran dummy dengan integrasi resmi **Midtrans Snap API**. Klien dapat langsung membayar tagihan via QRIS, GoPay, atau Virtual Account melalui modal popup.
- **Server-to-Server Webhook (`/api/webhooks/midtrans`):** Endpoint webhook menerima notifikasi real-time dari Midtrans.
- **Otomatisasi Status:** Saat status transaksi `settlement`/`capture`, sistem otomatis:
  1. Mengubah status transaksi menjadi `SUCCESS`.
  2. Mengubah status proyek menjadi `IN_PROGRESS`.
  3. Membunyikan notifikasi lonceng ke Worker terkait.
- **TypeScript Directive Fix:** Mengganti `@ts-ignore` pada `window.snap` dengan `@ts-expect-error` untuk menjaga kebersihan & keamanan tipe TypeScript.

### 💬 1.3 Floating Chat System & Project Chat Modular
- **Floating Chat Widget:** Menambahkan komponen *floating chat bubble* di pojok kanan bawah yang konsisten di seluruh ruang kerja (Admin, Client, dan Worker).
- **Dual Chat Mode:** Mendukung obrolan langsung (*Direct Chat*) antar pengguna dan obrolan khusus proyek (*Project Chat Drawer*).
- **Modularisasi Komponen:** Memisahkan komponen chat ke dalam folder khusus `src/components/chat/floating-widget/` dan `src/components/chat/project-chat/`.
- **Proteksi Proyek Batal:** Fitur input chat secara otomatis dinonaktifkan (*disabled*) jika status proyek adalah `CANCELLED`.
- **Dukungan i18n:** Teks obrolan terintegrasi dengan modul lokalisasi (`chat-i18n.ts`).

### 🛡️ 1.4 Proteksi Hasil Karya (Deliverables & Watermark)
- **Otomatisasi Watermark (`src/lib/watermark-utils.ts`):** Hasil karya berupa gambar yang diunggah oleh Worker secara otomatis disunting dengan *watermark* (tanda air) sebelum proyek dibayar lunas atau disetujui Klien.
- **Modul Deliverables Worker:** 
  - Modal upload dengan pratinjau gambar dan penambahan watermark.
  - Kartu deliverable & modal detail hasil kerja.
- **Modul Deliverables Klien:**
  - Halaman pratinjau hasil kerja Klien (`/client/deliverables`).
  - Modal pengajuan revisi (*Revision Modal*) dengan catatan detail untuk Worker.

### 📧 1.5 Otomatisasi Email Notifikasi (Resend API)
- Integrated Server Actions (`src/app/actions`) dengan **Resend Email Service**:
  1. **Email Request Proyek Baru:** Dikirim ke Worker saat Klien memilih Worker spesifik.
  2. **Email Penugasan Admin:** Dikirim ke Worker saat Admin memverifikasi & menugaskan proyek.
  3. **Email Penawaran Harga:** Dikirim ke Klien saat Worker menyetujui proyek dan menginput estimasi biaya & durasi.

### 📄 1.6 Generator PDF Terms & Conditions
- **API Endpoint (`/api/pdf/terms/[projectId]`):** Endpoint otomatis untuk me-render PDF Syarat & Ketentuan Layanan proyek.
- **Admin Terms Modal (`AdminCreateTermsModal`):** Memungkinkan Admin mengatur klausul & syarat khusus proyek sebelum diterbitkan ke Klien.

### 🧹 1.7 Cron Job Pembersihan Proyek Batal
- **Endpoint Cron (`/api/cron/cleanup-cancelled-projects/route.ts`):** Endpoint khusus untuk membersihkan atau mengarsip berkas & data proyek yang telah dibatalkan.

### 🎨 1.8 Restrukturisasi Codebase & Polish UI
- Modularisasi penuh komponen Worker (folder `projects/`, `tasks/`, `deliverables/`, `settings/`).
- Penambahan penanganan kasus batas (*edge cases safety*) pada `src/lib/edge-cases.ts`.
- Penyempurnaan kunci kamus bahasa pada `messages/id.json` dan `messages/en.json`.

---

## ⏳ 2. Daftar Tugas Yang Belum / Perlu Dilanjutkan Tim (Pending Tasks)

Berikut adalah poin-poin yang perlu diperhatikan dan dilanjutkan oleh tim developer:

### 1. 🔑 Konfigurasi Environment Production Midtrans
- [ ] Mengubah `MIDTRANS_CLIENT_KEY` dan `MIDTRANS_SERVER_KEY` dari mode Sandbox ke Production di environment Vercel / `.env.production`.
- [ ] Mengonfigurasi **Payment Notification URL** di Dashboard Midtrans Production ke:  
  `https://<domain-utama-anda>/api/webhooks/midtrans`

### 2. 📬 Verifikasi Domain Email Resend
- [ ] Menambahkan record DNS (TXT, MX, DKIM) di penyedia domain Anda untuk akun Resend.
- [ ] Mengganti pengirim email default di `src/app/actions/*.ts` dari domain testing (`onboarding@resend.dev`) ke domain resmi agensi Anda (misal: `notifications@craveitsm.com`).

### 3. 🗄️ Migrasi & Sinkronisasi Database Prisma
- [ ] Menjalankan migrasi database di lingkungan staging/production untuk memastikan model schema di `prisma/schema.prisma` tersinkronisasi penuh:
  ```bash
  npx prisma db push
  ```

### 4. 🔒 Pengamanan Endpoint Cron Job
- [ ] Menambahkan verifikasi token rahasia `CRON_SECRET` pada header request di `/api/cron/cleanup-cancelled-projects/route.ts` agar endpoint tidak dapat dipanggil sembarangan oleh pihak luar.

### 5. 🧪 Pengujian End-to-End (E2E) Lanjutan
- [ ] Melakukan simulasi alur kerja penuh bersama tim QA (Client -> Admin -> Worker -> Payment -> Watermark Deliverables -> Final Release).

---

## 🧪 3. Panduan Pengujian (Step-by-Step Testing Guide)

Gunakan langkah-langkah di bawah ini untuk memverifikasi setiap fitur yang telah dibangun hari ini:

### Test Case A: Pengujian Finance Dashboard & Navigasi Sidebar
1. **Langkah:**
   - Log in sebagai **Admin** (`/id/admin`) atau **Worker** (`/id/worker`).
   - Perhatikan menu **Sidebar** di sebelah kiri.
   - Klik menu **Keuangan / Finance** dengan ikon dompet (*Wallet*).
2. **Hasil Yang Diharapkan:**
   - Halaman Keuangan terbuka secara instan tanpa perlu memutar navigasi beranda.
   - Kartu statistik utama ("Total Pendapatan") tampil dengan desain *full-width* yang elegan.
   - Kartu Pendapatan Berhasil & Pending tampil rapi dalam susunan grid.

---

### Test Case B: Pengujian Pembayaran Midtrans Snap & Webhook
1. **Langkah:**
   - Log in sebagai **Klien** (`/id/client`).
   - Buka menu **Payments** atau halaman detail proyek yang membutuhkan DP/Pelunasan.
   - Klik tombol **Bayar Sekarang / Pay DP**.
   - Tunggu hingga modal **Midtrans Snap** muncul di layar.
   - Pilih metode pembayaran simulasi (misal: *Bank Transfer / Permata / QRIS Simulator*).
   - Gunakan [Midtrans Payment Simulator](https://simulator.sandbox.midtrans.com/) untuk menyelesaikan pembayaran test.
2. **Hasil Yang Diharapkan:**
   - Popup Midtrans muncul dengan mulus.
   - Setelah bayar di simulator, webhook `/api/webhooks/midtrans` akan menerima respons 200 OK.
   - Toast notifikasi "Pembayaran berhasil diproses!" muncul dan halaman memuat ulang (*reload*).
   - Status tagihan berubah menjadi `SUCCESS` dan proyek berubah menjadi `IN_PROGRESS`.

---

### Test Case C: Pengujian Floating Chat Widget
1. **Langkah:**
   - Buka halaman mana saja di ruang kerja Client, Admin, atau Worker.
   - Perhatikan ikon gelembung percakapan (*Floating Chat Bubble*) di pojok kanan bawah layar.
   - Klik gelembung tersebut untuk membuka jendela obrolan.
   - Coba kirim pesan pada **Direct Chat** atau **Project Chat**.
   - Buka proyek yang berstatus **CANCELLED** (Batal).
2. **Hasil Yang Diharapkan:**
   - Jendela chat melayang (*floating*) terbuka dengan animasi halus.
   - Pesan terikirim real-time dan tersimpan di database.
   - Pada proyek yang dibatalkan (`CANCELLED`), kolom input pesan terkunci (*disabled*) dengan keterangan bahwa obrolan untuk proyek batal telah ditutup.

---

### Test Case D: Pengujian Upload Deliverable & Watermark
1. **Langkah:**
   - Log in sebagai **Worker** (`/id/worker`).
   - Masuk ke menu **Deliverables** dan pilih proyek yang sedang berjalan.
   - Klik **Upload Deliverable**, lalu pilih file gambar (JPG/PNG).
   - Aktifkan opsi **Apply Watermark** saat mengunggah.
   - Log in sebagai **Klien** (`/id/client/deliverables`) untuk melihat file hasil karya yang diunggah Worker.
2. **Hasil Yang Diharapkan:**
   - File gambar yang diunggah oleh Worker menampilkan *watermark* semi-transparan "CRAVE PREVIEW" di atasnya.
   - Klien dapat melihat pratinjau file ber-watermark dan memiliki opsi untuk menekan **Ajukan Revisi** (dengan catatan revisi) atau **Setujui Hasil Karya**.

---

### Test Case E: Pengujian PDF Terms & Conditions
1. **Langkah:**
   - Log in sebagai **Admin**.
   - Buka halaman proyek dan klik tombol **Buat Syarat & Ketentuan (Terms)**.
   - Isi form klausul proyek lalu simpan.
   - Akses endpoint URL secara langsung di browser: `/api/pdf/terms/[projectId]`
2. **Hasil Yang Diharapkan:**
   - Browser me-render dokumen PDF Syarat & Ketentuan yang rapi lengkap dengan logo, rincian biaya, dan klausul persetujuan proyek.

---

## 🛠️ Perintah Utama Pengembang (Useful Commands)
- **Jalankan Server Lokal:** `npm run dev`
- **Cek Linting Codebase:** `npx next lint`
- **Sync Schema Database:** `npx prisma db push`
- **Buka Prisma Studio (Database Viewer):** `npx prisma studio`

---
*Dokumen ini dibuat otomatis sebagai laporan pembaruan resmi tim pengembangan Crave ITSM.*
