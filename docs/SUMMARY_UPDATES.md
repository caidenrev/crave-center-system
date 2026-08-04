# Dokumentasi Pembaruan & Fitur Platform Crave ITSM

**Tanggal**: 4 Agustus 2026  
**Status**: ✅ SELESAI & TERVERIFIKASI (Clean Code, 0 Build/Lint Error)

---

## 🚀 Ringkasan Pembaruan Hari Ini

### 1. 🌐 Penyelarasan Terjemahan Dwibahasa (i18n) & Penanganan Missing Keys
- **Masalah Teratasi**: Error `MISSING_MESSAGE: Could not resolve ClientProjects.btnChat in messages for locale id` & `AdminProjects.statusInWarranty`.
- **Kunci Baru Ditambahkan**:
  - `btnChat`: `"Pesan"` (ID) / `"Chat"` (EN)
  - `btnTerms`: `"Ketentuan & Kontrak"` (ID) / `"Terms & Contract"` (EN)
  - `btnDetail`: `"Detail"` (ID) / `"Details"` (EN)
  - `deadline` / `dueDate`: `"Tenggat"` (ID) / `"Deadline"` (EN)
  - `statusInWarranty`: `"Garansi"` (ID) / `"Warranty"` (EN)
- **Konsistensi Label**: Semua tombol aksi di Card dan Tabel pada Dashboard Admin, Worker, dan Client kini memiliki nama dan posisi yang konsisten di semua bahasa.

---

### 2. 🛡️ Keamanan & Penutupan Fitur Proyek Dibatalkan (`CANCELLED` / Rejected)
- **Nonaktif Tombol Chat & Terms**:
  - Di **Dashboard Admin**, **Worker**, dan **Client**, proyek yang berstatus `CANCELLED` memiliki tombol `Pesan / Chat` dan `Ketentuan & Kontrak` yang dinonaktifkan (*disabled*, *greyed-out*, kursor *not-allowed*).
  - Pada **Project Detail Modal (Admin & Worker)**, tombol untuk membuka chat atau membuat terms juga dikunci untuk proyek batal.
- **Drawer Real-time Chat ([project-chat-drawer.tsx](file:///d:/crave-center-system/src/components/chat/project-chat-drawer.tsx))**:
  - Ketika chat dibuka untuk proyek yang dibatalkan, sistem menampilkan *notice banner*: *"Diskusi proyek ini telah ditutup karena status proyek dibatalkan / ditolak."* dan kolom pengisian pesan dikunci (*disabled*).

---

### 3. 🔄 Flow Visibilitas & Penugasan Proyek Worker
- **Alur Kerja Pengajuan**:
  1. Klien membuat request proyek baru -> Status `"REQUESTED"`. Proyek **hanya muncul di Dashboard Admin** (halaman Job Requests).
  2. Admin menyetujui request dan memilih/menugaskan worker -> Status berubah menjadi `"WORKER_REVIEW"` & `workerId` terisi.
  3. Proyek **baru muncul di Dashboard Worker yang ditugaskan**. Notifikasi otomatis dikirim ke worker tersebut.
- **Pembaruan Query Prisma**:
  - `src/app/[locale]/(worker)/worker/projects/page.tsx`: Menyaring proyek agar tidak menampilkan status `"REQUESTED"` sebelum penugasan admin.
  - `src/app/[locale]/(worker)/worker/page.tsx`: Menyaring `pendingRequests` untuk proyek berstatus `"WORKER_REVIEW"`.
  - `src/app/actions/project.ts`: Mengirim notifikasi `createJobRequest` ke tim Admin alih-alih worker sebelum penugasan admin.

---

### 4. 🎨 Redesain UI/UX Toolbar, Card, dan Badge Status
- **Toolbar & System Filter**:
  - Meredesain toolbar pada Dashboard Admin & Worker ke dalam **layout 2-tier responsif** (Pencarian & Switcher Tampilan Grid/Table di atas, *scrollable status pills* di bawah).
- **Redesain Tombol Aksi Card**:
  - Menata tombol pada card proyek ke dalam struktur 2 baris teratur:
    - **Baris 1**: `Ketentuan & Kontrak` (*Full width*, aksen ungu).
    - **Baris 2**: `Pesan` dan `Detail` (Grid 2 kolom 50:50 simetris).
- **Penyelaras Badge Status Worker**:
  - Menyelaraskan warna dan ikon badge status di Dashboard Worker ([worker-projects-client.tsx](file:///d:/crave-center-system/src/components/worker/worker-projects-client.tsx)) agar 100% cocok dengan Dashboard Admin:
    - `IN_PROGRESS` (Berlangsung): Hijau Emerald + `<PlayCircle />`
    - `COMPLETED` (Selesai): Hijau Emerald + `<CheckCircle />`
    - `PENDING_DP` (Menunggu DP): Amber/Kuning + `<Clock />`
    - `WORKER_REVIEW` (Review Worker): Ungu + `<AlertCircle />`
    - `ON_HOLD` (Tertunda): Orange + `<Clock />`
    - `IN_WARRANTY` (Garansi): Cyan + `<ShieldCheck />`
    - `CANCELLED` (Dibatalkan): Merah + `<AlertCircle />`

---

### 5. 📂 Pembersihan & Refactoring Root Folder Project
- Memindahkan file dokumentasi `.md` dari root directory ke folder dedicated `docs/`:
  - `docs/task.md`
  - `docs/PRD-Crave-ITSM-Platform.md`
  - `docs/requirements.md`
  - `docs/design.md`
  - `docs/ADMIN_UPDATE_DOCUMENTATION.md`
- Menghapuskan file duplikat `run.js` (digantikan oleh `scripts/enable-realtime.ts`).

---

## ✅ Verifikasi Kualitas Kode (Clean Code Audit)

- **Duplikasi Kode**: 0 duplikasi (Komponen modular, fungsi `getStatusBadge` & `ProjectChatDrawer` dimanfaatkan kembali).
- **TypeScript Compliance**: `node node_modules/typescript/bin/tsc --noEmit` -> **0 Error**.
- **JSON Schema Integrity**: Terverifikasi valid (`node` JSON parse OK).
- **Checklist Task**: Berhasil diperbarui pada [docs/task.md](file:///d:/crave-center-system/docs/task.md).
