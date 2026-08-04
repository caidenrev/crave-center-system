# Product Requirements Document
## Crave — IT Service Management Platform

| Atribut | Keterangan |
|---|---|
| **Versi Dokumen** | 1.1 |
| **Tanggal** | 25 Juli 2026 |
| **Status** | Draft |
| **Author** | Founder / Product Owner |

---

## Changelog

**v1.2** — Memperbarui User Flow dan Modul 4 dengan penambahan skenario edge cases: logika Auto-Pause (status On Hold), Auto-Approve untuk deliverable, Gatekeeper File Final (penahan akses unduhan sebelum pelunasan 100%), Klausul Pembatalan, dan Fase Garansi. Menstandarisasi skema basis data (Bagian 8) dengan penambahan atribut `created_at`, `updated_at`, dan penyempurnaan nilai ENUM status pada beberapa entitas.

**v1.1** — Menambahkan modul Revision Tracking, Scope Change/Change Request, Invoice Otomatis, Template Project, Client Onboarding Checklist, Audit Log, dan Export Laporan Client.

**v1.0** — Draft awal PRD.

---

## 1. Latar Belakang & Tujuan

Crave adalah platform berbasis web yang menghubungkan client dengan tim internal untuk kebutuhan jasa pengembangan IT (web development, app development, sistem custom, dan solusi teknologi lainnya). Berbeda dari model agency tradisional yang mengandalkan komunikasi manual via WhatsApp/email, Crave mengelola seluruh siklus kerja — mulai dari request, negosiasi, kontrak, pembayaran, hingga tracking progres dan delivery — dalam satu platform terpusat.

### 1.1 Masalah yang Diselesaikan

- Proses request-to-delivery jasa IT sering tersebar di banyak channel (WhatsApp, email, dokumen terpisah) sehingga sulit ditelusuri.
- Client tidak punya visibilitas jelas terhadap status dan progres pekerjaan mereka.
- Tidak ada histori terstruktur untuk kontrak, kesepakatan harga, dan milestone pembayaran.
- Tim internal butuh sistem manajemen tugas yang terhubung langsung dengan kebutuhan client, bukan tools terpisah.

### 1.2 Tujuan Produk

- Menyediakan satu pintu masuk bagi client untuk mengajukan kebutuhan IT.
- Mengotomatisasi alur kerja dari request → negosiasi → kontrak → pengerjaan → delivery.
- Memberi visibilitas progres real-time ke client dan tim.
- Membangun data historis (estimasi vs aktual waktu pengerjaan) untuk meningkatkan akurasi estimasi proyek ke depannya.

---

## 2. Target Pengguna & Roles

| Role | Deskripsi |
|---|---|
| **Client** | Perusahaan/UMKM yang membutuhkan jasa pengembangan IT |
| **Admin / Project Manager (PM)** | Mengelola request masuk, negosiasi, assign tugas ke tim, memantau progres keseluruhan |
| **Team Member (Developer)** | Mengerjakan task yang di-assign, update progres, upload deliverable |

---

## 3. User Flow (End-to-End)

1. Client mendaftar/login → mengisi form job requirement (kebutuhan IT + budget range).
2. Request masuk ke dashboard Admin dengan status **Requested**.
3. Admin review request → melakukan negosiasi (scope, harga, timeline) langsung di platform dengan Client.
4. Setelah disepakati, sistem generate **Terms** (scope kerja, milestone, harga final) → Client menyetujui.
5. **Contract** digenerate otomatis dari Terms yang disepakati, disetujui secara digital oleh Client (checkbox + timestamp).
6. Client melakukan pembayaran (DP/milestone) melalui payment gateway.
7. Status project berubah menjadi **In Progress** → Admin memecah project menjadi task-task dan assign ke Team Member.
8. Team Member mengerjakan task, update progres & actual time.
   - *Edge case:* Jika Client tidak memberikan data/respons yang dibutuhkan selama lebih dari **3 hari** saat pengerjaan, sistem otomatis mengubah status menjadi **On Hold** dan menyesuaikan deadline.
9. Client dapat memantau progres secara real-time (progress bar, status task, estimated vs actual time).
10. Setelah seluruh task selesai, Team Member/Admin upload **deliverable** (source code, demo link, file).
11. Client review deliverable → approve atau request revisi.
    - *Edge case:* Jika Client tidak merespons dalam **14 hari kerja**, sistem akan memicu **Auto-Approve**.
12. Setelah disetujui (**Approved**), sistem akan mengecek status pembayaran:
    - Jika **Milestone**: Sistem otomatis menerbitkan Invoice Pelunasan. Setelah dibayar, akses file final dibuka.
    - Jika **Full Payment**: Sistem langsung membuka akses file final kepada klien.
13. Setelah file diserahkan, status project berubah menjadi **In Warranty** (masa garansi dimulai).
14. Setelah masa garansi selesai tanpa kendala, status project otomatis menjadi **Completed**.

---

## 4. Fitur Utama (Functional Requirements)

### 4.1 Modul: Job Request
- Form pengajuan kebutuhan IT: jenis project, deskripsi, referensi/lampiran, deadline harapan, budget range.
- Client dapat melihat status semua request yang pernah diajukan.

### 4.2 Modul: Negosiasi & Terms
- Chat/negosiasi in-app antara Client dan Admin.
- Auto-generate dokumen Terms dari hasil kesepakatan (scope, milestone, harga final, timeline).
- Client dapat approve atau meminta revisi Terms.
- Parameter Terms mencakup penentuan durasi **Fase Garansi** (misal: 7 hari, 14 hari, atau tidak ada) tergantung jenis layanan yang disepakati.
- Sistem menyediakan templat **Klausul Pembatalan** otomatis pada Terms, yang mengatur status pengembalian dana (DP hangus/dikembalikan) jika proyek dihentikan di tengah jalan.

### 4.3 Modul: Contract
- Contract digenerate otomatis dari Terms yang disetujui.
- Persetujuan digital sederhana (checkbox + timestamp, bukan tanda tangan digital kompleks di versi awal).
- Riwayat kontrak dapat diunduh (PDF).

### 4.4 Modul: Payment
- Mendukung pembayaran milestone-based (contoh: 50% DP, 50% saat delivery) atau full payment.
- Integrasi payment gateway lokal (Midtrans/Xendit) — mendukung QRIS, transfer bank, e-wallet.
- Riwayat transaksi pembayaran per project.
- Sistem otomatis memicu tagihan/invoice pelunasan tepat setelah Client menyetujui (Approve) hasil akhir (khusus untuk skema milestone).

### 4.5 Modul: Task & Progress Tracking
- Admin memecah project menjadi task-task dan assign ke Team Member.
- Setiap task memiliki: deskripsi, assignee, estimasi waktu pengerjaan, deadline, status (To Do, In Progress, Review, Done).
- Setiap task mencatat actual time saat diselesaikan (untuk perbandingan estimasi vs aktual).
- Progress bar project dihitung otomatis dari task yang selesai.
- Notifikasi/alert ke Admin jika task melewati estimasi waktu tanpa selesai (indikasi delay).
- Dashboard workload tim (siapa sedang sibuk, siapa available) untuk membantu Admin melakukan assignment.
- Admin/PM atau Client dapat membatalkan proyek. Sistem akan merubah status project menjadi **Cancelled** dan membekukan sisa milestone pembayaran.
- Sistem otomatis mengubah status project menjadi **On Hold** jika Client tidak memberikan data/respons yang dibutuhkan selama lebih dari 3 hari. Deadline proyek otomatis bergeser menyesuaikan durasi jeda.

### 4.6 Modul: Delivery
- Upload deliverable (file, source code, link demo) oleh Team Member/Admin.
- Client dapat approve delivery atau mengajukan revisi dengan catatan.
- Sistem memiliki batas waktu persetujuan otomatis (**Auto-Approve**). Jika Client tidak merespons dalam 14 hari kerja sejak deliverable dikirim, sistem otomatis menyetujui hasil kerja.
- Akses unduhan file final atau source code akan ditahan oleh sistem dan hanya terbuka secara otomatis jika status pembayaran proyek sudah lunas 100% *(Gatekeeper File Final)*.
- Setelah file final diserahkan (lunas), status project = **In Warranty** (jika ada masa garansi). Client dapat mengajukan perbaikan minor selama fase ini tanpa biaya tambahan. Setelah masa garansi usai, status = **Completed**.

### 4.7 Modul: Communication
- Chat internal tim (tidak terlihat oleh Client) untuk diskusi teknis.
- Chat/update yang terlihat oleh Client untuk komunikasi progres dan klarifikasi kebutuhan.
- Notifikasi (in-app, opsional email/WhatsApp) untuk update status penting.

### 4.8 Modul: Role & Access Management
- Autentikasi & otorisasi berbasis role (Client, Admin/PM, Team Member).
- Setiap role hanya melihat data dan fitur yang relevan dengan perannya.

### 4.9 Modul: Revision Tracking *(Fase 2)*
- Histori setiap revisi yang diminta Client per deliverable (apa yang diminta, kapan, oleh siapa).
- Batas jumlah revisi gratis sesuai Terms — revisi di luar batas memicu Change Request.

### 4.10 Modul: Scope Change / Change Request *(Fase 2)*
- Client dapat mengajukan perubahan/tambahan requirement di tengah project.
- Admin mengevaluasi dampak biaya & waktu, lalu meminta persetujuan ulang Client sebelum dikerjakan.
- Setiap Change Request tercatat sebagai adendum terhadap Contract/Terms awal.

### 4.11 Modul: Invoice Otomatis *(Fase 2)*
- Generate invoice PDF otomatis setiap kali pembayaran diterima.
- Berguna untuk keperluan pembukuan Client, terutama Client berbadan usaha.

### 4.12 Modul: Template Project *(Fase 2)*
- Template task breakdown untuk jenis project yang berulang (misal: landing page, sistem inventory sederhana).
- Mempercepat proses breakdown task oleh Admin dan membuat estimasi lebih konsisten antar project sejenis.

### 4.13 Modul: Client Onboarding Checklist *(Fase 2)*
- Checklist kebutuhan awal dari Client sebelum pengerjaan dimulai (akses hosting, brand asset, kredensial API, dsb).
- Mencegah delay project akibat menunggu data/akses dari Client.

### 4.14 Modul: Audit Log *(Fase 3)*
- Mencatat seluruh aktivitas penting: siapa approve apa, kapan harga/status berubah, dsb.
- Berfungsi sebagai bukti historis jika terjadi perselisihan terkait kesepakatan atau kontrak.

### 4.15 Modul: Export Laporan untuk Client *(Fase 3)*
- Laporan progres project dalam format PDF yang dapat diunduh/dikirim Client ke pihak internal mereka.

---

## 5. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| **Performance** | Dashboard dan update status harus real-time atau near real-time (< 3 detik delay) |
| **Security** | Data client (kontrak, pembayaran) terenkripsi; role-based access control ketat |
| **Scalability** | Arsitektur harus mampu menangani pertumbuhan jumlah project tanpa refactor besar di awal |
| **Availability** | Target uptime 99% untuk MVP (tidak perlu high-availability kompleks di tahap awal) |
| **Usability** | UI harus sederhana dan jelas bagi Client non-teknis maupun Team Member teknis |

---

## 6. Cakupan Pengembangan (Scoping)

### 6.1 Fase 1 — MVP (Prioritas Utama)
- Job Request form
- Dashboard Admin (approve/reject request)
- Negosiasi in-app sederhana (chat + Terms manual generate)
- Contract sederhana (approval checkbox + PDF)
- Payment (DP + pelunasan, integrasi 1 payment gateway)
- Task management dasar (assign, status, estimasi waktu, actual time)
- Progress tracking untuk Client (progress bar + status)
- Delivery upload & approval

### 6.2 Fase 2 — Pengembangan Lanjutan
- Notifikasi WhatsApp/email otomatis
- Timeline/Gantt chart view
- Dashboard analitik (akurasi estimasi historis, performa tim)
- Sistem rating/feedback dari Client per project
- Multi-milestone payment yang lebih fleksibel
- Revision Tracking
- Scope Change / Change Request
- Invoice Otomatis
- Template Project
- Client Onboarding Checklist

### 6.3 Fase 3 — Penguatan Proses & Kepercayaan
- Audit Log
- Export Laporan untuk Client

### 6.4 Out of Scope (Tidak termasuk MVP)
- Marketplace terbuka untuk freelancer eksternal
- Sistem lelang/bidding project
- Tanda tangan digital berstandar hukum (e-signature bersertifikat)
- Aplikasi mobile native (fokus web app/PWA dahulu)

---

## 7. Rancangan Teknis (High-Level)

| Layer               | Teknologi yang Direkomendasikan                                                                                                 |                  |              |
| ---------------------| ---------------------------------------------------------------------------------------------------------------------------------| ------------------| --------------|
| **Frontend**        | React / Next.js (Web App / PWA)                                                                                                 | Shadcn Component | Tailwind CSS |
| **Backend**         | Node.js (Express/NestJS) atau AWS Lambda (serverless)                                                                           |                  |              |
| **Database**        | Amazon Aurora PostgreSQL Serverless (AWS Free Tier) — cocok untuk data relasional (users, projects, tasks, contracts, payments) |                  |              |
| **File Storage**    | Amazon S3 (untuk lampiran, deliverable, dokumen kontrak)                                                                        |                  |              |
| **Payment Gateway** | Midtrans atau Xendit (QRIS, transfer bank, e-wallet)                                                                            |                  |              |
| **Hosting/CDN**     | AWS App Runner / EC2 kecil untuk backend; CloudFront untuk frontend jika diperlukan                                             |                  |              |
| **Autentikasi**     | AWS Cognito atau JWT-based auth custom                                                                                          |                  |              |

> **Catatan:** Pemilihan Aurora PostgreSQL Serverless didasarkan pada sifat data yang sangat relasional (banyak foreign key antar entitas project, task, contract, payment). AWS Free Tier terbaru mendukung hingga 4 ACU dan 1 GB storage secara gratis — cukup untuk tahap MVP dan awal produksi.

---

## 8. Entitas Data Utama (Draft)

Draft awal entitas data — untuk dikembangkan lebih lanjut menjadi database schema:

- **User** (`id`, `name`, `email`, `role`, `phone`, `created_at`, `updated_at`)
- **Project** (`id`, `client_id`, `title`, `description`, `budget_range`, `status` [Requested, In Progress, On Hold, In Warranty, Completed, Cancelled], `estimated_duration`, `target_delivery_date`, `created_at`, `updated_at`)
- **Terms** (`id`, `project_id`, `scope`, `price_final`, `milestones`, `status` [Draft, Revised, Approved], `approved_by_client`, `created_at`, `updated_at`)
- **Contract** (`id`, `project_id`, `terms_id`, `contract_document_url`, `signed_at`, `created_at`)
- **Payment** (`id`, `project_id`, `amount`, `type` [DP/Pelunasan], `status`, `payment_method`, `paid_at`, `created_at`, `updated_at`)
- **Task** (`id`, `project_id`, `title`, `assignee_id`, `estimated_time`, `actual_time`, `status`, `deadline`, `created_at`, `updated_at`, `completed_at`)
- **Deliverable** (`id`, `project_id`, `file_url`, `description`, `uploaded_by`, `status`, `created_at`, `updated_at`)
- **Message** (`id`, `project_id`, `sender_id`, `content`, `visibility` [internal/client], `created_at`)
- **Revision** (`id`, `deliverable_id`, `requested_by`, `note`, `status` [Pending, Resolved], `created_at`, `updated_at`)
- **ChangeRequest** (`id`, `project_id`, `description`, `cost_impact`, `time_impact`, `status` [Requested, Approved, Rejected], `created_at`, `updated_at`, `approved_at`)
- **Invoice** (`id`, `payment_id`, `invoice_number`, `file_url`, `issued_at`)
- **AuditLog** (`id`, `actor_id`, `action`, `entity_type`, `entity_id`, `created_at`)

---

## 9. Metrik Keberhasilan (Success Metrics)

- Jumlah project yang selesai tepat waktu (actual time ≤ estimated time) — **target awal: 70%**
- Waktu rata-rata dari request masuk hingga contract disetujui
- Tingkat kepuasan client (bisa diukur informal di awal, formal di Fase 2)
- Jumlah project aktif yang dapat ditangani tim tanpa overload (dari data workload dashboard)

---

## 10. Catatan untuk Tahap Development

Dokumen ini dirancang untuk dijadikan acuan pengembangan menggunakan tools AI-assisted development (Antigravity / Kiro AWS). Setiap modul pada Bagian 4 dapat dipecah lebih lanjut menjadi user stories dan task teknis sesuai kebutuhan tools tersebut. Skema database pada Bagian 8 bersifat draft awal dan perlu divalidasi/dinormalisasi lebih lanjut sebelum implementasi.
