# 📄 Dokumentasi Update UI/UX & Panduan Integrasi Backend Admin Panel

**Tanggal Update:** 3 Agustus 2026  
**Status Kode:** Clean Code, Zero Build Errors (`npx tsc --noEmit` PASS)  
**Versi Framework:** Next.js 16 (App Router) + TailwindCSS v4 + Supabase Auth & Storage + Prisma ORM  

---

## 📌 Ringkasan Eksekutif Update

Pembaruan besar-besaran (*complete overhaul & polish*) pada seluruh modul **Admin Panel Crave ITSM Center System** mencakup pembersihan bug arsitektur autentikasi, penyempurnaan UI/UX modern, penataan tata letak responsif, serta internasionalisasi (i18n) Bahasa Indonesia & Inggris 100% konsisten.

---

## 🛠️ 1. Perbaikan Bug & Arsitektur Utama yang Telah Selesai

### A. Fix Error `net::ERR_RESPONSE_HEADERS_TOO_BIG` pada Akun Admin
- **Penyebab:** Foto profil disimpan dalam bentuk raw Base64 string (>10KB) di `user_metadata` Supabase Auth. Hal ini menyebabkan cookie JWT terpecah menjadi banyak chunk melebihi batas header browser (16KB+).
- **Solusi Yang Telah Diterapkan:**
  1. Membersihkan Base64 string pada tabel `auth.users` di Postgres (`scripts/clean-metadata.ts`).
  2. Dibuatkan public storage bucket `avatars` di Supabase Storage beserta RLS Policies (`storage.objects`) melalui `scripts/create-storage-bucket.ts`.
  3. Modul `AdminSettingsClient` diperbarui untuk mengunggah berkas gambar langsung ke bucket Supabase `avatars` dan hanya menyimpan URL publik pendek (`https://.../avatars/...`).

### B. Admin Layout Shell & Topbar Khusus Admin
- **Masalah:** Terjadi pencarian ganda (*duplicate search bar*) pada topbar admin.
- **Solusi:** Dibuatkan `AdminLayoutShell` dan `AdminTopbar` khusus admin, serta integrasi *slide-over drawer menu* untuk tampilan Mobile & Tablet dengan tombol hamburger.

### C. Pembenahan Hydration Error & i18n Date Formatting
- Dihilangkan error *Hydration Mismatch* pada komponen `AdminApplicationsClient` dengan menggunakan format ISO deterministik (`YYYY-MM-DD`) dan penambahan atribut `suppressHydrationWarning`.
- Seluruh 5 halaman admin kini 100% menggunakan `next-intl` (`messages/id.json` & `messages/en.json`).

---

## 🎨 2. Daftar Redesign UI/UX Halaman Admin

1. **Dashboard Overview:**
   - Grid 4 kartu statistik teratas berformat responsif 2 kolom pada mobile/tablet.
   - Header kartu *Platform Activity* & *Team Capacity* dibuat simetris 1:1 dengan *glowing icon badge*.
   - Diagram Donut *Worker Workload* mendukung **3 status sekaligus** (`Available`, `Busy`, `Away`) secara 100% dinamis.
   - Section *Dynamic System Alerts* terhubung ke Prisma DB.
2. **Job Requests Management:**
   - Redesign tabel menjadi **Modern Data Table** dengan status badge berindikator dot, avatar initials klien, dan modal *View Brief* & *Assign Worker*.
3. **Active Client Projects:**
   - Kartu proyek dengan *animated progress bar*, tag status ber-kategori warna, chip pekerja, dan switcher tampilan Grid/Tabel.
4. **Team Workload:**
   - Redesign section *Active Tasks & Kapasitas* menjadi kartu indikator kapasitas modern (`0/5 Tasks`, *linear progress bar*, `% capacity badge`).
   - Kartu responsif 2 kolom pada tampilan mobile/tablet.
5. **Worker Applications:**
   - Kartu pelamar dengan *skill pills*, chip tautan portofolio (GitHub, LinkedIn, Portfolio), dan tombol aksi WhatsApp Interview, Reject, & Approve.

---

## 📊 3. Pemetaan Status Data: Dinamis vs Statis / Mock (Panduan Backend)

Tabel berikut menjelaskan fitur apa saja yang **sudah dinamis (terhubung DB/Storage)** dan apa yang **masih berupa fallback/mock data (perlu diselesaikan Tim Backend)**:

| Halaman / Fitur | Status Data Saat Ini | Sumber Data Saat Ini | Tugas Tim Backend (Yang Harus Dibuat) |
| :--- | :--- | :--- | :--- |
| **Admin Settings - Profile Upload** | 🟢 **Dinamis 100%** | Supabase Storage (`avatars` bucket) & Supabase Auth (`user_metadata`) | Selesai. Tidak perlu perubahan. |
| **Admin Settings - Platform Rules** | 🟡 **Statis (UI Client State)** | Client Component State (`autoHold: 3`, `autoApprove: 14`) | **Buat tabel `PlatformRule` di Prisma DB** & API Server Action untuk menyimpan ambang batas otomatisasi (Auto-Hold & Auto-Approve). |
| **Overview - System Alerts** | 🟢 **Dinamis 100%** | Real-time Prisma Query (`workerApplication`, `project`, DB status) | Selesai. Data otomatis menyesuaikan isi database. |
| **Overview - Bar Chart (Activity)** | 🟡 **Statis / Demo** | Mock Array (`weeklyData` & `monthlyData` di `admin-activity-chart.tsx`) | **Buat Server Query / Aggregation** untuk menghitung jumlah project requested & completed per hari/bulan dari tabel `Project`. |
| **Overview - Donut Chart (Capacity)**| 🟢 **Dinamis 100%** | Real-time Prisma Count (`User` role TEAM_MEMBER & project assignment) | Selesai. Mengisi status Available, Busy, & Away otomatis dari DB. |
| **Job Requests - Listing Table** | 🟢 **Dinamis 80%** + Demo Fallback | Real-time Prisma Query (`Project` status REQUESTED/WORKER_REVIEW/PENDING_DP) | Tabel membaca dari Prisma DB. Jika DB kosong, menampilkan 3 item demo. Backend tinggal menambah Server Action `assignWorkerToProject(projectId, workerId)`. |
| **Job Requests - Assign Worker** | 🟡 **Statis (Client State)** | Mock array `mockWorkersList` & Local State | **Hubungkan modal Assign** ke data user bertipe `TEAM_MEMBER` di DB & jalankan mutation update `project.workerId`. |
| **Active Projects - Cards** | 🟢 **Dinamis 80%** + Demo Fallback | Real-time Prisma Query (`Project` include `tasks`, `client`, `worker`) | Menghitung persen penyelesaian dari perbandingan task status `DONE`. Backend tinggal melengkapi manajemen task. |
| **Team Workload - Member List** | 🟡 **Statis / Demo** | Mock array di `admin/team/page.tsx` | **Buat Prisma Query** untuk mengambil daftar `User` role `TEAM_MEMBER`, beserta count project aktif yang sedang dipegang. |
| **Team Workload - Send Message** | 🟡 **Statis (UI Modal)** | Toast notification saja | **Buat tabel/fitur `Notification` / `InternalMessage`** untuk mengirim notifikasi pesan ke worker. |
| **Worker Applications - Listing** | 🟢 **Dinamis 100%** | Real-time Prisma Query (`WorkerApplication` status PENDING) | Selesai. Membaca data pelamar asli dari database. |
| **Worker Applications - Approve/Reject**| 🟢 **Dinamis 100%** | Server Action `reviewApplication(appId, action)` | Selesai. Mengubah role user di DB dari `CLIENT` menjadi `TEAM_MEMBER` saat disetujui. |

---

## 🛠️ 4. Panduan Implementasi Langkah demi Langkah untuk Tim Backend

### 1. Integrasi Modal Penetapan Worker (`assignWorkerToProject`)
- **File Target:** `src/components/admin/admin-requests-client.tsx`
- **Tugas Backend:**
  - Buat Server Action di `src/app/actions/project.ts`:
    ```typescript
    export async function assignWorker(projectId: string, workerId: string) {
      await requireRole(["ADMIN"])
      await prisma.project.update({
        where: { id: projectId },
        data: { 
          workerId: workerId,
          status: "WORKER_REVIEW" 
        }
      })
      revalidatePath('/[locale]/admin/requests')
    }
    ```
  - Ganti `mockWorkersList` pada `admin-requests-client.tsx` dengan daftar `TEAM_MEMBER` yang di-pass dari Server Component `admin/requests/page.tsx`.

### 2. Agregasi Grafik Activity Chart
- **File Target:** `src/components/admin/admin-activity-chart.tsx`
- **Tugas Backend:**
  - Buat fungsi query di `src/app/[locale]/(admin)/admin/page.tsx` untuk menghitung `groupBy` tanggal pembuatan `Project` selama 7 hari atau 6 bulan terakhir.
  - Pass props data agregasi tersebut ke `<AdminActivityChart weeklyData={...} monthlyData={...} />`.

### 3. Penyimpanan Aturan Platform (`AdminSettings`)
- **File Target:** `src/components/admin/admin-settings-client.tsx`
- **Tugas Backend:**
  - Tambahkan model Prisma:
    ```prisma
    model SystemSetting {
      id String @id @default(cuid())
      autoHoldDays Int @default(3)
      autoApproveDays Int @default(14)
      updatedAt DateTime @updatedAt
    }
    ```
  - Buat Server Action `updateSystemSettings({ autoHoldDays, autoApproveDays })`.

---

## ✅ 5. Verifikasi Terakhir Sebelum Commit & Push
- `npx tsc --noEmit` : **PASSED (0 Errors)**
- Autentikasi Admin: **PASSED (Sesi & Avatar lancar)**
- Switch Bahasa (ID / EN): **PASSED (100% i18n synced)**
- Responsivitas Mobile / Tablet: **PASSED (Hamburger drawer & 2-col cards lancar)**

---
*Dokumentasi ini dibuat untuk mempermudah alur kerja tim backend dalam melanjutkan pengembangan.*
