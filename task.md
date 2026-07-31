# Task Breakdown (MVP - Fase 1)

Berikut adalah daftar task yang perlu dikerjakan untuk mengembangkan platform MVP Crave ITSM.

## 1. Setup & Infrastruktur
- [x] Inisialisasi Project Next.js Full-stack (App Router + Tailwind CSS + ShadcnUI).
- [x] Setup Prisma ORM terintegrasi di dalam project Next.js.
- [x] Setup Database Supabase PostgreSQL dan migrasi awal (skema tabel MVP).
- [x] Setup Supabase Storage (beserta IAM/Policies untuk akses file).
- [ ] Setup CI/CD pipeline (Staging environment).

## 2. Autentikasi & RBAC
- [x] Setup tabel `User` di Prisma dan Trigger sinkronisasi dari Supabase Auth.
- [x] Implementasi Halaman Register / Login (dengan animasi Framer Motion).
- [x] Pembuatan middleware Role-Based Access Control (RBAC) (Client, Admin, Team Member).
- [ ] Seeding akun dummy untuk Admin dan Team Member.

## 3. Modul Job Request
- [x] Halaman Form Job Request (Client side).
- [x] Dashboard Pekerja (Worker Dashboard) & Integrasi Email Resend: Menampilkan daftar Job Request masuk ke pekerja.
- [x] Integrasi Frontend-Backend untuk submit Job Request.
- [x] Fitur Negosiasi Harga (Worker Submit Quote -> Client Accept Quote).

## 4. Modul Negosiasi, Terms & Contract
- [ ] UI/UX Halaman Detail Project (Chat Interface).
- [ ] API untuk sistem messaging berbasis teks (Internal vs Client visibility).
- [ ] Halaman Admin untuk membuat "Terms" (Scope, Harga, Milestone).
- [ ] UI Client untuk review Terms dan fitur Digital Checkbox approval.
- [ ] Generate Contract otomatis dalam bentuk file (PDF generation/HTML to PDF) disimpan ke S3.

## 5. Modul Task Management & Progress
- [ ] Halaman manajemen Task di dashboard Admin/Team Member (Kanban/List view).
- [ ] Form pembuatan dan assignment Task.
- [ ] Fungsi pencatatan `actual_time` saat Task diubah ke Done.
- [ ] API penghitung persentase progres (progress bar) project.
- [ ] Cron Job (opsional/MVP) untuk set status project `On Hold` (delay > 3 hari).

## 6. Modul Delivery & Gatekeeper
- [ ] Halaman upload Deliverable (Team Member/Admin).
- [ ] Integrasi upload ke S3 dan simpan `file_url` ke database.
- [ ] Halaman review Deliverable (Client side).
- [ ] Implementasi Cron Job untuk "Auto-Approve" setelah 14 hari tanpa respons.
- [ ] Implementasi middleware/logic "Gatekeeper File Final" (cegah download S3 URL jika belum lunas).

## 7. Modul Payment
- [ ] Integrasi Payment Gateway (Midtrans/Xendit) untuk pembuatan invoice/Link Bayar.
- [ ] Webhook handler dari Payment Gateway (untuk update status payment & trigger invoice pelunasan).
- [ ] Halaman riwayat pembayaran di sisi Client dan Admin.

## 8. Finalisasi MVP & Testing
- [ ] Testing End-to-End untuk User Flow dari Request sampai Delivery.
- [ ] Testing Edge Cases (Auto-Pause, Auto-Approve, Gatekeeper).
- [ ] Deployment ke Production environment.
- [ ] UAT (User Acceptance Testing) bersama Product Owner.

## 9. Lokalisasi & UI/UX Refinement
- [x] Implementasi terjemahan dwibahasa (EN/ID) pada semua halaman Marketing dan Auth.
- [x] Perbaikan form Login/Register (tambahan field lengkap & layout seamless di mobile).
- [x] Penyesuaian layout *Trusted By* (siap untuk slider full-width) dan styling angka komponen *Resources*.
- [x] Optimalisasi responsivitas *form* registrasi (pemangkasan *padding* & grid horizontal di desktop).
- [x] Implementasi animasi Flip Card 3D pada profil tim (halaman *About*).
- [x] Perbaikan efek bayangan (*shadow*) pada Navbar dan *card Pricing* khusus mobile.
- [x] Optimalisasi slider harga (*pricing*) di mobile agar *card* selanjutnya tertutup sempurna.
- [x] Konversi bendera *language switcher* menggunakan gambar SVG dari CDN.
- [x] Konversi bendera *language switcher* menggunakan gambar SVG dari CDN.
- [x] Implementasi animasi *Marquee* yang berjalan otomatis tanpa batas pada bagian logo klien.

## 10. Tambahan Dasbor Klien & Pekerja
- [x] Implementasi tampilan "Dasbor Klien" yang modern dan *real-time*.
- [x] Halaman *Active Projects*, *Contracts & Terms*, dan *Payment History* di dasbor klien.
- [x] Pembuatan sistem *update profile* (*Settings*) untuk Klien.
- [x] Integrasi dan fiksasi fungsi *Logout* terpusat.
