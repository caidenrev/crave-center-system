# System Design Document - Crave ITSM Platform

Dokumen ini mendeskripsikan rancangan arsitektur dan sistem berdasarkan `PRD-Crave-ITSM-Platform.md`.

## 1. High-Level Architecture

| Komponen            | Rekomendasi Teknologi                                                                                |
| ---------------------| ------------------------------------------------------------------------------------------------------|
| **Framework** | Next.js (App Router) - Full-stack (Frontend & Backend API) |
| **Database** | Amazon Aurora PostgreSQL Serverless (AWS Free Tier) |
| **File Storage**    | Cloudinary                                                                                           |
| **Payment Gateway** | Midtrans                                                                                             |
| **Hosting & CI/CD** | Vercel (Rekomendasi untuk Full-stack Next.js) atau AWS Amplify |
| **Authentication**  | NextAuth.js (Auth.js) atau Supabase Auth |

## 2. Database Schema (PostgreSQL)

Berikut adalah desain tabel utama (relasional) yang menopang MVP:

- `users`
  - id (PK, UUID)
  - name, email, phone
  - role (ENUM: Client, Admin, TeamMember)
  - password_hash
  - created_at, updated_at

- `projects`
  - id (PK, UUID)
  - client_id (FK -> users.id)
  - title, description, budget_range
  - status (ENUM: Requested, In Progress, On Hold, In Warranty, Completed, Cancelled)
  - estimated_duration, target_delivery_date
  - created_at, updated_at

- `terms`
  - id (PK, UUID)
  - project_id (FK -> projects.id)
  - scope (TEXT), price_final (DECIMAL)
  - milestones (JSONB)
  - status (ENUM: Draft, Revised, Approved)
  - approved_by_client (BOOLEAN)
  - created_at, updated_at

- `contracts`
  - id (PK, UUID)
  - project_id (FK -> projects.id)
  - terms_id (FK -> terms.id)
  - contract_document_url
  - signed_at, created_at

- `payments`
  - id (PK, UUID)
  - project_id (FK -> projects.id)
  - amount (DECIMAL)
  - type (ENUM: DP, Pelunasan, Milestone)
  - status (ENUM: Pending, Success, Failed)
  - payment_method, paid_at
  - created_at, updated_at

- `tasks`
  - id (PK, UUID)
  - project_id (FK -> projects.id)
  - title, description
  - assignee_id (FK -> users.id)
  - estimated_time (INT, jam)
  - actual_time (INT, jam)
  - status (ENUM: To Do, In Progress, Review, Done)
  - deadline (TIMESTAMP)
  - completed_at, created_at, updated_at

- `deliverables`
  - id (PK, UUID)
  - project_id (FK -> projects.id)
  - file_url, description
  - uploaded_by (FK -> users.id)
  - status (ENUM: Pending Review, Approved, Revised)
  - created_at, updated_at

- `messages`
  - id (PK, UUID)
  - project_id (FK -> projects.id)
  - sender_id (FK -> users.id)
  - content (TEXT)
  - visibility (ENUM: Internal, Client)
  - created_at

## 3. Core Logic & Edge Cases

1. **Gatekeeper File Final**:
   - Ketika client men-download file melalui `GET /api/deliverables/:id/download`, sistem akan mengecek relasi `payments` dari `projects` tersebut.
   - Jika total payment masuk (Success) < `price_final` pada `terms`, sistem mengembalikan error/403.
   
2. **Auto-Approve Deliverable**:
   - Terdapat Cron Job harian yang mengecek tabel `deliverables` dengan status `Pending Review`.
   - Jika `NOW() - created_at > 14 days`, maka status diubah menjadi `Approved`.

3. **Auto-Hold Project**:
   - Cron Job harian mengecek tabel pesan/interaksi terakhir dari client.
   - Jika tidak ada interaksi selama > 3 hari ketika status project sedang menunggu input/approval, ubah status project ke `On Hold` dan update `target_delivery_date`.
