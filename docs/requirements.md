# Product Requirements Document (Detailed) - Crave ITSM Platform

Berdasarkan dokumen `PRD-Crave-ITSM-Platform.md`, berikut adalah breakdown kebutuhan (requirements) sistem.

## 1. Functional Requirements

### 1.1 MVP (Fase 1 - Prioritas Utama)

**Modul Job Request**
- Form pengajuan kebutuhan IT (jenis project, deskripsi, referensi/lampiran, deadline harapan, budget range).
- Client dapat melihat status semua request yang pernah diajukan.

**Modul Negosiasi & Terms**
- Chat/negosiasi in-app antara Client dan Admin.
- Auto-generate dokumen Terms dari hasil kesepakatan (mencakup scope, milestone, harga final, timeline, durasi garansi, dan klausul pembatalan).
- Client dapat menyetujui (approve) atau meminta revisi Terms.

**Modul Contract**
- Contract otomatis ter-generate dari Terms yang disetujui.
- Persetujuan digital sederhana (checkbox persetujuan + timestamp).
- Unduh kontrak dalam format PDF.

**Modul Payment**
- Mendukung sistem pembayaran milestone-based (misal: 50% DP, 50% pelunasan) atau full payment.
- Integrasi Payment Gateway lokal (Midtrans / Xendit) untuk mendukung QRIS, Transfer Bank, E-Wallet.
- Riwayat transaksi pembayaran per project.
- Tagihan/invoice otomatis terbit saat Client menyetujui hasil akhir (skema milestone).

**Modul Task & Progress Tracking**
- Admin dapat memecah project menjadi Task dan meng-assign ke Team Member.
- Data Task: deskripsi, assignee, estimasi waktu, actual time (saat diselesaikan), deadline, dan status (To Do, In Progress, Review, Done).
- Progress bar project dihitung otomatis secara real-time berdasarkan task yang selesai.
- Notifikasi alert ke Admin jika pengerjaan task melewati estimasi waktu.
- Dashboard Workload tim (melihat availability dan load kerja anggota tim).
- Pembatalan Proyek (Cancel) oleh Admin/PM/Client dan pembekuan sisa milestone.
- **Auto-Hold Project**: Sistem otomatis set status 'On Hold' dan menggeser deadline jika Client tidak merespons/memberikan data dalam waktu > 3 hari.

**Modul Delivery**
- Upload deliverable (file, source code, link demo) oleh Team Member/Admin.
- Client dapat approve delivery atau mengajukan revisi (beserta catatan).
- **Auto-Approve**: Sistem otomatis approve jika tidak ada respons Client selama > 14 hari kerja.
- **Gatekeeper File Final**: Akses unduhan deliverable ditahan sistem hingga status pembayaran proyek lunas 100%.
- Peralihan otomatis status project menjadi In Warranty (Masa Garansi) setelah file final diserahkan (lunas), kemudian Completed.

**Modul Communication & Role Management**
- Chat internal tim (tersembunyi dari Client) & Chat eksternal (terlihat oleh Client).
- Autentikasi dan otorisasi berbasis Role (Client, Admin/PM, Team Member).

### 1.2 Fase Lanjutan (Fase 2 & Fase 3)
- Notifikasi via WhatsApp / Email.
- Timeline / Gantt chart view.
- Dashboard analitik performa dan historis estimasi.
- Revision Tracking (Riwayat revisi, pembatasan jumlah revisi gratis).
- Scope Change / Change Request (Adendum Contract untuk perubahan di tengah project).
- Invoice otomatis dalam format PDF.
- Template Project (untuk task berulang).
- Client Onboarding Checklist.
- Audit Log (Pencatatan seluruh aktivitas penting/perubahan status).
- Export Laporan Progress PDF untuk Client.

## 2. Non-Functional Requirements

- **Performance:** Dashboard dan update status harus real-time atau near real-time (delay < 3 detik).
- **Security:** Data kontrak dan pembayaran terenkripsi. Role-based access control (RBAC) diimplementasikan dengan ketat.
- **Scalability:** Arsitektur backend dan database harus dirancang agar bisa scale tanpa refactor besar.
- **Availability:** Target uptime minimum 99% untuk tahap MVP.
- **Usability:** UI/UX harus intuitif dan mudah dipahami, khususnya bagi Client yang non-teknis.
