<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/dark-mode-logo.png">
    <source media="(prefers-color-scheme: light)" srcset="public/light-mode-logo.png">
    <img alt="Crave Logo" src="public/light-mode-logo.png" height="80">
  </picture>
</p>

# Crave ITSM

Crave ITSM is a modern, scalable B2B IT Service Management platform designed specifically to streamline and automate IT project workflows. From initial client request and contract negotiation, to task execution, secure file delivery, and automated invoicing, Crave provides a complete ecosystem for digital agencies and IT consultancies.

## Core Modules & Features

The platform is divided into several highly integrated modules to ensure seamless project lifecycles:

### 1. Job Request & Contract Negotiation
- **Digital Job Requests:** Clients can submit detailed IT project requirements, including budget ranges and deadlines.
- **In-App Negotiation:** Built-in chat interface for internal team discussions and client-facing negotiations.
- **Automated Contracts & Terms:** Auto-generation of terms (scope, milestones, final pricing, warranty clauses) with digital checkbox approval.
- **PDF Generation:** Finalized contracts are automatically converted to PDF and securely stored.

### 2. Task & Progress Management
- **Kanban & List Views:** Efficient task distribution among team members with time estimations and actual time tracking.
- **Real-Time Progress:** Project progress bars update dynamically based on completed tasks.
- **Auto-Hold Mechanism:** Projects automatically shift to 'On Hold' status with shifted deadlines if a client becomes unresponsive for over 3 days.
- **Workload Dashboard:** Admin visibility into team availability and resource allocation.

### 3. Secure Delivery & Gatekeeper
- **Milestone Deliverables:** Team members upload deliverables (files, source code, demo links) directly to AWS S3/Supabase Storage.
- **Gatekeeper Protocol:** A strict security layer prevents clients from downloading final deliverables until the project invoice is marked as 100% paid.
- **Auto-Approval:** Deliverables are automatically marked as approved if the client fails to respond within 14 working days.
- **Warranty Tracking:** Automated transition to 'In Warranty' status post-delivery.

### 4. Payment & Invoicing
- **Milestone Billing:** Support for split payments (e.g., 50% downpayment, 50% final settlement) or full upfront payments.
- **Payment Gateway Integration:** Integrated with Midtrans/Xendit to support Virtual Accounts, QRIS, and E-Wallets via automated webhooks.
- **Automated Invoicing:** Invoices are generated and issued automatically upon milestone completion.

### 5. Role-Based Access Control (RBAC) & Localization
- **Strict Role Separation:** Distinct dashboards and permissions for Clients, Admins/PMs, and Team Members.
- **Real-Time Localization:** Full bilingual support (English and Indonesian) implemented via `next-intl`.

## Technology Stack

- **Frontend & Backend:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, ShadcnUI, Framer Motion
- **Database:** PostgreSQL (hosted on Supabase)
- **ORM:** Prisma
- **Storage:** Supabase Storage / AWS S3
- **Internationalization:** next-intl

## Getting Started

### Prerequisites
- Node.js 18.x or newer
- npm, yarn, or pnpm
- A Supabase account and PostgreSQL database

### Environment Variables
Create a `.env` file in the root of the project and configure the following variables:

```env
# Database Configuration (Prisma / Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Authentication (Supabase Auth or Custom)
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Payment Gateway (Example: Midtrans)
MIDTRANS_SERVER_KEY="your-server-key"
MIDTRANS_CLIENT_KEY="your-client-key"
```

### Installation & Setup

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Run database migrations:**
   Push the Prisma schema to your Supabase PostgreSQL database to create all necessary tables.
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure Overview

- `/src/app`: Next.js App Router pages (divided by `[locale]` for i18n).
- `/src/components`: Reusable UI components (ShadcnUI) and marketing sections.
- `/src/lib`: Core utility functions, Prisma client instance (`db.ts`), and helpers.
- `/src/actions`: Server actions for form submissions and data mutations.
- `/messages`: JSON translation dictionaries for English (`en.json`) and Indonesian (`id.json`).
- `/prisma`: Database schema definitions (`schema.prisma`).

## Future Roadmap (Phase 2 & 3)

- Automated Email and WhatsApp Notifications.
- Interactive Gantt chart timeline views.
- Advanced performance analytics and historical estimation accuracy.
- Automated client onboarding checklists.
- Revision tracking and limitation mechanics.
- Exportable PDF progress reports for clients.
