# 📋 Changelog — Crave Center System
## Sesi Malam, 8 Agustus 2026 (18:46 – 22:00 WIB)

---

## Ringkasan

Sesi pengembangan malam ini berfokus pada **perbaikan bug kritis**, **penyesuaian alur bisnis (business logic)**, **redesain UI untuk konsistensi antar-dashboard**, dan **internasionalisasi (i18n)**. Total **15+ file** dimodifikasi di seluruh tiga workspace (Admin, Worker, Client).

---

## Daftar Perubahan

### 🐛 1. Fix: `setState` Synchronous dalam `useEffect`

**File:** `src/components/admin/overview/admin-calendar.tsx`

- **Masalah:** React menampilkan error *"Calling setState synchronously within an effect can trigger cascading renders"* karena `setTime(new Date())` dipanggil langsung di body `useEffect`.
- **Solusi:** Menghapus pemanggilan `setTime` sinkron dan menginisialisasi state `time` langsung dengan `new Date()`, hanya menyisakan `setInterval` di dalam `useEffect`.

---

### 🎨 2. Fix: Badge Warna Status `WORKER_REVIEW` di Dashboard Admin

**File:** `src/components/admin/projects/admin-projects-client.tsx`

- **Masalah:** Badge status `WORKER_REVIEW` berwarna **ungu** di dashboard Admin, padahal di dashboard Worker berwarna **kuning/amber**.
- **Solusi:** Mengubah warna badge `WORKER_REVIEW` pada halaman `/admin/requests` menjadi **amber/kuning** agar konsisten di seluruh dashboard.

---

### 🔄 3. Fix: Progress Completion 25% pada Proyek Berstatus `WORKER_REVIEW`

**File:** `src/components/client/projects/client-project-tracker.tsx`, `src/components/worker/projects/worker-projects-client.tsx`

- **Masalah:** Card proyek yang masih berstatus `WORKER_REVIEW` sudah menampilkan progress 25%, padahal worker belum menyetujui kontrak maupun mengerjakan task apapun.
- **Solusi:** Menyesuaikan fungsi `getProgress()` agar status `REQUESTED` dan `WORKER_REVIEW` selalu mengembalikan **0%**. Progress baru mulai dihitung setelah status proyek memasuki tahap `PENDING_DP` ke atas.

---

### 🌐 4. Fix: Hydration Error di Dashboard Client

**File:** Komponen-komponen yang menggunakan `Date.now()` / `new Date()` tanpa `suppressHydrationWarning`

- **Masalah:** React menampilkan *"Hydration failed because the server rendered text didn't match the client"* akibat perbedaan format tanggal antara server dan client rendering.
- **Solusi:** Menambahkan `suppressHydrationWarning` pada elemen yang menampilkan tanggal/waktu dinamis.

---

### 📐 5. Redesain: Konsistensi Card Proyek di Semua Dashboard

**Files:**
- `src/components/client/projects/client-project-tracker.tsx`
- `src/components/admin/projects/admin-projects-client.tsx`
- `src/components/worker/projects/worker-projects-client.tsx`

- **Masalah:** Card proyek di ketiga dashboard (Admin, Worker, Client) memiliki layout yang tidak seragam — tinggi card berbeda-beda jika teks panjang, dan elemen-elemen tidak sejajar.
- **Solusi:** Menyeragamkan card layout dengan:
  - Fixed height dan `line-clamp` untuk judul/deskripsi.
  - Grid/flex alignment yang konsisten.
  - Arch gauge progress bar yang seragam.

---

### 🌍 6. Fix: Internasionalisasi (i18n) — Missing Keys & Hardcoded Strings

**Files:**
- `messages/en.json`
- `messages/id.json`
- `src/components/worker/projects/worker-projects-client.tsx`
- `src/components/worker/overview/worker-reminders.tsx`
- `src/components/worker/overview/worker-new-requests.tsx`

- **Masalah:**
  1. Console error: *"MISSING_MESSAGE: Could not resolve `WorkerDashboard.close`"*
  2. Tombol *"Beri Penawaran"* masih hardcoded dalam bahasa Indonesia meskipun locale sedang `en`.
- **Solusi:**
  - Menambahkan key `close`, `makeOfferBtn`, `editOfferBtn`, `offerSubmittedStatus`, `offerNotSubmittedStatus` ke dalam `WorkerDashboard` namespace di kedua file bahasa.
  - Mengganti semua string hardcoded `"Beri Penawaran"` dengan `t("makeOfferBtn")` / `t("editOfferBtn")` secara dinamis.
  - **Hasil audit i18n:** 100% parity antara `en.json` dan `id.json` (0 missing keys).

---

### 💰 7. Feature: Penawaran Worker Ditampilkan di Dashboard Client

**File:** `src/components/client/projects/client-project-tracker.tsx`

- **Sebelumnya:** Penawaran harga dari Worker hanya masuk sebagai notifikasi, tidak tampil langsung di card proyek Client.
- **Perubahan:**
  - Menambahkan **Quote Offered Banner** (`Rp X.XXX.XXX (Y hari)`) langsung di card proyek Client ketika Worker sudah mengirim penawaran.
  - Menambahkan tombol **"Terima Penawaran"** yang langsung dapat di-klik Client untuk menyetujui quote tanpa harus berpindah halaman.

---

### ⚖️ 8. Fix: Alur Pembuatan Kontrak & Terms (Business Logic Kritis)

**File:** `src/app/actions/client.ts`

- **Masalah:** Saat Client mengklik *"Terima Penawaran"*, fungsi `approveProjectQuote` secara otomatis membuat record `Terms` dengan status `DRAFT`. Ini menyalahi alur bisnis karena **hanya Admin yang berhak menerbitkan dokumen Kontrak & Terms resmi**.
- **Solusi:**
  - **Menghapus** `prisma.terms.create` dari fungsi `approveProjectQuote`.
  - Saat Client menyetujui penawaran harga, status proyek diubah menjadi `PENDING_DP` dan notifikasi dikirim ke Worker & Admin.
  - Pembuatan Terms resmi tetap menjadi tanggung jawab Admin melalui fungsi `saveProjectTerms` di `src/app/actions/project.ts`.

---

### 🔒 9. Fix: Proteksi Tombol Cetak & Setujui Terms di Halaman Kontrak Client

**Files:**
- `src/app/[locale]/(client)/client/contracts/page.tsx`
- `src/components/client/contracts/client-contracts-view.tsx`

- **Masalah:** Tombol *"Cetak"* (PDF) dan *"Setujui Terms"* masih aktif/bisa diklik pada proyek yang **belum** diterbitkan dokumen kontrak resmi oleh Admin.
- **Penyebab Root:** Data mapping sebelumnya melakukan fallback `priceFinal: offeredPrice` dan `scope: description`, sehingga aplikasi menganggap dokumen sudah tersedia.
- **Solusi:**
  - Menambahkan flag `hasOfficialContract` yang secara ketat memeriksa apakah:
    - Admin sudah membuat record `Contract`, **ATAU**
    - Admin sudah menerbitkan `Terms` dengan `status === "APPROVED"` dan `scope` & `priceFinal` terisi valid.
  - Jika `hasOfficialContract === false`:
    - `priceFinal` → `0`
    - `scope` → `null`
    - Badge Status Persetujuan: **"Menunggu Dokumen"** (Slate/Grey, disabled)
    - Tombol **"Cetak"**: **Disabled** dengan tooltip *"Dokumen kontrak belum diterbitkan oleh Admin"*
    - Tombol **"Setujui Terms"**: **Disabled** dengan label *"Belum Tersedia"*

---

### 🪟 10. Feature: Modal Detail Proyek Client (Redesain Konsisten)

**File:** `src/components/client/projects/client-project-tracker.tsx`

- **Sebelumnya:** Tombol *"Detail"* pada card proyek Client hanya berupa `<Link>` menuju halaman `/client/projects` (tidak membuka modal).
- **Perubahan:**
  - Mengganti `<Link>` menjadi `<button>` yang membuka **Project Detail Modal** kaya fitur.
  - **Fitur Modal Detail Client** (konsisten dengan desain modal Admin & Worker):
    - Header: ID Proyek Badge + Status Badge berwarna + tombol Close.
    - Meta Info Grid: Assigned Worker & Target Delivery Date.
    - Progress Bar: Penyelesaian proyek (%).
    - Kotak Brief/Deskripsi Proyek (whitespace-preserved).
    - Tombol Download Lampiran File Brief.
    - Banner Penawaran Worker + tombol *"Terima Penawaran"* (jika status `WORKER_REVIEW`).
    - Footer: Tombol *Pesan* (Chat), *Batalkan Proyek* (dengan Confirm Modal), dan *Tutup*.

---

### 📂 11. Penyeragaman Ikon Sidebar Finance

**Files:**
- `src/components/layout/client-sidebar.tsx`
- `src/components/layout/admin-sidebar.tsx` *(terverifikasi konsisten)*
- `src/components/layout/worker-sidebar.tsx` *(terverifikasi konsisten)*

- **Perubahan:** Mengganti ikon menu *Finance* dari `DollarSign` menjadi `Wallet` di sidebar Client agar konsisten dengan sidebar Admin dan Worker.

---

### 📄 12. Redesain: Halaman Kontrak & Terms Client

**File:** `src/components/client/contracts/client-contracts-view.tsx`

- **Perubahan:**
  - Menambahkan **Top Stat Summary Cards** (Total Kontrak, Disetujui & Aktif, Menunggu Persetujuan).
  - Menambahkan **Filter Pills** (Semua Kontrak, Menunggu Persetujuan, Disetujui).
  - Menambahkan **View Mode Switcher** (Table View ↔ Grid Cards).
  - Layout redesain keseluruhan agar lebih solid, elegan, dan responsif.

---

## File yang Dimodifikasi (Ringkasan)

| # | File | Jenis Perubahan |
|---|------|-----------------|
| 1 | `src/components/admin/overview/admin-calendar.tsx` | Bug fix (setState) |
| 2 | `src/components/admin/projects/admin-projects-client.tsx` | Badge warna |
| 3 | `src/components/worker/projects/worker-projects-client.tsx` | i18n, card layout |
| 4 | `src/components/worker/overview/worker-reminders.tsx` | i18n |
| 5 | `src/components/worker/overview/worker-new-requests.tsx` | i18n |
| 6 | `src/components/client/projects/client-project-tracker.tsx` | Modal detail, progress, quote banner |
| 7 | `src/components/client/contracts/client-contracts-view.tsx` | Redesain, proteksi tombol |
| 8 | `src/components/layout/client-sidebar.tsx` | Ikon sidebar |
| 9 | `src/app/actions/client.ts` | Business logic (remove auto-terms) |
| 10 | `src/app/[locale]/(client)/client/contracts/page.tsx` | Data mapping + hasOfficialContract |
| 11 | `messages/en.json` | i18n keys |
| 12 | `messages/id.json` | i18n keys |

---

## Verifikasi

- ✅ **TypeScript Compilation** (`npx tsc --noEmit`): **0 Errors**
- ✅ **i18n Audit**: 100% parity `en.json` ↔ `id.json` (0 missing keys)
- ✅ **Hydration Errors**: Resolved
- ✅ **Console Errors**: Resolved (`WorkerDashboard.close`)
- ✅ **Business Logic**: Kontrak hanya terbit setelah Admin menerbitkan dokumen resmi

---

> **Catatan:** Dokumen ini dibuat secara otomatis berdasarkan sesi pengembangan malam 8 Agustus 2026.
