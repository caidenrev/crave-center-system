"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import * as React from "react"
import { ArrowLeft, ArrowDown, Settings, Users, Rocket, CheckCircle2, TrendingUp, Clock, DollarSign, Play, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useTranslations } from "next-intl"

const getResourceContent = (locale: string) => {
  const isId = locale === 'id';
  
  return {
    "getting-started": {
      title: isId ? "Memulai dengan Crave ITSM" : "Getting Started with Crave ITSM",
      tag: isId ? "Panduan" : "Guide",
      content: (
        <div className="space-y-12 text-left">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
            {isId ? "Selamat datang di Crave ITSM! Panduan ini akan memandu Anda melalui langkah-langkah penting untuk mengonfigurasi ruang kerja Anda, mengundang anggota tim, dan meluncurkan proyek pertama Anda dengan aman." : "Welcome to Crave ITSM! This guide will walk you through the essential steps to configure your workspace, invite team members, and launch your first project securely."}
          </p>

          <div className="flex flex-col gap-10">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="space-y-3 pt-1">
                <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
                  <Settings className="w-6 h-6 text-primary" /> {isId ? "Konfigurasi Ruang Kerja" : "Workspace Configuration"}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {isId ? "Ruang kerja Anda adalah markas digital agensi Anda. Buka panel " : "Your workspace is your agency's digital headquarters. Navigate to the "}<strong className="text-foreground">{isId ? "Pengaturan" : "Settings"}</strong>{isId ? " untuk mengatur nama perusahaan Anda, mengunggah logo merek Anda, dan mengonfigurasi zona waktu default Anda." : " panel to set your company name, upload your brand logo, and configure your default timezone."}
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-200 mt-4 flex items-start gap-3">
                  <div className="font-bold shrink-0 mt-0.5">{isId ? "Kiat Pro:" : "Pro Tip:"}</div> 
                  <p>{isId ? "Mengatur warna merek Anda sejak awal memastikan semua portal yang menghadap klien terlihat profesional sejak hari pertama." : "Setting your brand colors early ensures all client-facing portals look professional from day one."}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center md:justify-start -my-4 relative z-0">
              <div className="flex flex-col items-center gap-1">
                <div className="w-1 h-6 bg-gradient-to-b from-primary/30 to-primary/60 rounded-full" />
                <ArrowDown className="w-8 h-8 text-primary/80" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="space-y-3 pt-1">
                <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
                  <Users className="w-6 h-6 text-primary" /> {isId ? "Undangan Tim" : "Team Invitations"}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {isId ? "Buka tab " : "Go to the "}<strong className="text-foreground">{isId ? "Tim" : "Team"}</strong>{isId ? ' dan klik "Undang Anggota". Anda dapat menetapkan peran tertentu menggunakan sistem RBAC Lanjutan kami untuk memastikan anggota tim hanya melihat apa yang perlu mereka lihat.' : ' tab and click "Invite Member". You can assign specific roles using our Advanced RBAC system to ensure team members only see what they need to.'}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 bg-muted/30 p-5 rounded-2xl border border-border">
                  <li className="flex items-center gap-3 text-sm font-semibold text-foreground"><CheckCircle2 className="w-5 h-5 text-success" /> Admin</li>
                  <li className="flex items-center gap-3 text-sm font-semibold text-foreground"><CheckCircle2 className="w-5 h-5 text-success" /> {isId ? "Manajer Proyek" : "Project Manager"}</li>
                  <li className="flex items-center gap-3 text-sm font-semibold text-foreground"><CheckCircle2 className="w-5 h-5 text-success" /> {isId ? "Pengembang" : "Developer"}</li>
                  <li className="flex items-center gap-3 text-sm font-semibold text-foreground"><CheckCircle2 className="w-5 h-5 text-success" /> {isId ? "Tamu Klien" : "Client Guest"}</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center md:justify-start -my-4 relative z-0">
              <div className="flex flex-col items-center gap-1">
                <div className="w-1 h-6 bg-gradient-to-b from-primary/30 to-primary/60 rounded-full" />
                <ArrowDown className="w-8 h-8 text-primary/80" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="space-y-3 pt-1">
                <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
                  <Rocket className="w-6 h-6 text-primary" /> {isId ? "Membuat Proyek" : "Creating a Project"}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {isId ? "Klik " : "Click "}<strong className="text-foreground">{isId ? "Proyek Baru" : "New Project"}</strong>{isId ? " dari Pusat Komando. Tentukan ruang lingkup, atur pencapaian penagihan, dan aktifkan " : " from the Command Center. Define the scope, set up the billing milestones, and activate the "}<strong className="text-foreground">{isId ? "Escrow Penjaga Gerbang" : "Gatekeeper Escrow"}</strong>{isId ? " untuk mengamankan dana Anda sebelum menulis satu baris kode pun." : " to secure your funds before writing a single line of code."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    "case-study-globex": {
      title: isId ? "Bagaimana Globex Mengurangi Faktur Belum Dibayar Sebesar 98%" : "How Globex Reduced Unpaid Invoices by 98%",
      tag: isId ? "Studi Kasus" : "Case Study",
      content: (
        <div className="space-y-12 text-left">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
            {isId ? "Globex Corporation, sebuah rumah perangkat lunak menengah, berjuang dengan tingkat faktur belum dibayar 15% pada proyek harga tetap. Klien sering menunda pembayaran akhir setelah menerima kode sumber." : "Globex Corporation, a mid-sized software house, was struggling with a 15% unpaid invoice rate on fixed-price projects. Clients would often delay final payments after receiving the source code."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-border">
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 bg-success/10 text-success rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-foreground">98%</div>
              <div className="text-sm font-semibold text-muted-foreground">{isId ? "Penurunan faktur belum dibayar" : "Reduction in unpaid invoices"}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-foreground">{isId ? "6 Bulan" : "6 Months"}</div>
              <div className="text-sm font-semibold text-muted-foreground">{isId ? "Waktu untuk stabilisasi penuh" : "Time to full stabilization"}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-foreground">+25%</div>
              <div className="text-sm font-semibold text-muted-foreground">{isId ? "Peningkatan arus kas" : "Increase in cash flow"}</div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-destructive/5 border border-destructive/20 p-6 md:p-8 rounded-3xl">
              <h3 className="text-2xl font-black text-destructive mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" /> {isId ? "Tantangan" : "The Challenge"}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {isId ? "Tanpa leverage, Globex menghabiskan waktu berjam-jam mengejar klien untuk pembayaran, sangat berdampak pada arus kas dan moral pengembang mereka. Kurangnya jalur pengiriman yang terstandarisasi berarti klien dapat menyandera proyek yang telah selesai." : "Without leverage, Globex spent countless hours chasing clients for payment, severely impacting their cash flow and developer morale. The lack of a standardized delivery pipeline meant clients could hold completed projects hostage."}
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-6 md:p-8 rounded-3xl">
              <h3 className="text-2xl font-black text-primary mb-4 flex items-center gap-2">
                <Rocket className="w-6 h-6" /> {isId ? "Solusi: Crave ITSM" : "The Solution: Crave ITSM"}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {isId ? "Globex mengimplementasikan fitur " : "Globex implemented Crave's "}<strong className="text-primary">{isId ? "Escrow Penjaga Gerbang" : "Gatekeeper Escrow"}</strong>{isId ? " dari Crave. Sekarang, pengiriman kode sumber dikunci secara terprogram. Klien harus menyetujui pencapaian dan melepaskan dana dari escrow sebelum jalur penerapan dieksekusi." : " feature. Now, source code delivery is programmatically locked. Clients must approve the milestone and release funds from escrow before the deployment pipeline executes."}
              </p>
            </div>

            <div className="bg-success/5 border border-success/20 p-6 md:p-8 rounded-3xl">
              <h3 className="text-2xl font-black text-success mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" /> {isId ? "Hasilnya" : "The Results"}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {isId ? "Dalam 6 bulan, Globex melihat pengurangan 98% dalam faktur yang belum dibayar. Arus kas stabil, dan perselisihan klien turun secara signifikan karena pelacakan pencapaian yang transparan dan komitmen keuangan di muka." : "Within 6 months, Globex saw a 98% reduction in unpaid invoices. Cash flow stabilized, and client disputes dropped significantly due to the transparent milestone tracking and upfront financial commitment."}
              </p>
            </div>
          </div>
        </div>
      )
    },
    "escrow-workflows": {
      title: isId ? "Menyiapkan Alur Kerja Escrow Otomatis" : "Setting Up Automated Escrow Workflows",
      tag: isId ? "Video Tutorial" : "Video Tutorial",
      content: (
        <div className="space-y-12 text-left">
          <div className="relative w-full aspect-video bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border border-zinc-800">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300 shadow-xl">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-white font-bold text-lg mb-2">{isId ? "Tutorial: Alur Kerja Escrow" : "Tutorial: Escrow Workflows"}</div>
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-primary" />
              </div>
            </div>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
            {isId ? "Dalam video tutorial ini, kami membahas penyiapan teknis sistem Escrow Otomatis kami. Anda akan mempelajari cara mengamankan dana proyek Anda bahkan sebelum pekerjaan dimulai." : "In this video tutorial, we cover the technical setup of our Automated Escrow system. You will learn how to secure your project funds before the work even begins."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 font-bold">01</div>
              <h4 className="font-bold text-foreground mb-2">{isId ? "Hubungkan Stripe" : "Connect Stripe"}</h4>
              <p className="text-sm text-muted-foreground">{isId ? "Integrasikan akun Stripe Connect Anda untuk menerima setoran klien dengan aman." : "Integrate your Stripe Connect account to securely accept client deposits."}</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 font-bold">02</div>
              <h4 className="font-bold text-foreground mb-2">{isId ? "Pemicu Pencapaian" : "Milestone Triggers"}</h4>
              <p className="text-sm text-muted-foreground">{isId ? "Tentukan pemicu berdasarkan penggabungan PR GitHub atau persetujuan URL pementasan." : "Define triggers based on GitHub PR merges or staging URL approvals."}</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 font-bold">03</div>
              <h4 className="font-bold text-foreground mb-2">{isId ? "Aturan Rilis" : "Release Rules"}</h4>
              <p className="text-sm text-muted-foreground">{isId ? "Konfigurasikan sistem untuk melepaskan dana secara otomatis setelah tinjauan 7 hari." : "Configure the system to release funds automatically after a 7-day review."}</p>
            </div>
          </div>
        </div>
      )
    },
    "sla-management": {
      title: isId ? "Praktik Terbaik untuk Manajemen SLA Agensi" : "Best Practices for Agency SLA Management",
      tag: isId ? "Laporan Resmi" : "Whitepaper",
      content: (
        <div className="space-y-10 text-left">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium pb-8 border-b border-border">
            {isId ? "Perjanjian Tingkat Layanan (SLA) adalah tulang punggung kepercayaan dalam layanan TI B2B. Laporan resmi ini menguraikan praktik terbaik industri untuk mendefinisikan, melacak, dan memenuhi SLA tanpa membuat tim teknik Anda kelelahan." : "Service Level Agreements (SLAs) are the backbone of trust in B2B IT services. This whitepaper outlines the industry best practices for defining, tracking, and meeting SLAs without burning out your engineering team."}
          </p>

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
              {isId ? "Tentukan Metrik yang Jelas dan Terukur" : "Define Clear, Measurable Metrics"}
            </h3>
            <p className="text-muted-foreground font-medium pl-11">
              {isId ? 'Hindari istilah yang tidak jelas seperti "respon cepat". Gunakan metrik spesifik seperti "Waktu Respon Awal: < 4 jam selama jam kerja".' : 'Avoid vague terms like "fast response". Use specific metrics such as "Initial Response Time: < 4 hours during business hours".'}
            </p>
            <div className="pl-11 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-xl flex gap-3">
                <XCircle className="w-5 h-5 text-destructive shrink-0" />
                <span className="text-sm text-destructive font-semibold">{isId ? '"Kami akan memperbaiki bug secepat mungkin."' : '"We will fix bugs as soon as possible."'}</span>
              </div>
              <div className="bg-success/5 border border-success/20 p-4 rounded-xl flex gap-3">
                <CheckCircle className="w-5 h-5 text-success shrink-0" />
                <span className="text-sm text-success font-semibold">{isId ? '"Bug kritis diselesaikan dalam 24 jam."' : '"Critical bugs resolved within 24h."'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</span>
              {isId ? "Otomatisasi Pelacakan" : "Automate Tracking"}
            </h3>
            <p className="text-muted-foreground font-medium pl-11">
              {isId ? "Gunakan Pusat Komando Crave untuk menjeda pengatur waktu SLA secara otomatis saat menunggu umpan balik klien. Ini memastikan laporan Anda secara akurat mencerminkan kinerja tim Anda, mencegah pelanggaran SLA palsu ketika klien terlalu lama membalas." : "Use Crave's Command Center to automatically pause SLA timers when waiting for client feedback. This ensures your reports accurately reflect your team's performance, preventing false SLA breaches when clients take too long to reply."}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-foreground flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">3</span>
              {isId ? "Komunikasi Proaktif" : "Proactive Communication"}
            </h3>
            <p className="text-muted-foreground font-medium pl-11">
              {isId ? "Siapkan peringatan otomatis saat SLA mencapai kapasitas 80%. Selalu lebih baik untuk secara proaktif menginformasikan keterlambatan kepada klien daripada membiarkan pelanggaran SLA tidak disadari. Transparansi membangun kepercayaan, bahkan ketika Anda melewati tenggat waktu." : "Set up automated alerts when an SLA is at 80% capacity. It is always better to proactively inform a client of a delay than to let an SLA breach go unnoticed. Transparency builds trust, even when you miss a deadline."}
            </p>
          </div>
        </div>
      )
    }
  }
}

export default function ResourceDetailPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const resolvedParams = React.use(params)
  // @ts-ignore - Ignore type error for simple dynamic key lookup
  const data = getResourceContent(resolvedParams.locale)[resolvedParams.slug]

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold">{resolvedParams.locale === 'id' ? 'Sumber daya tidak ditemukan' : 'Resource not found'}</h1>
        <Link href="/resources" className="text-primary hover:underline">{resolvedParams.locale === 'id' ? 'Kembali ke Pusat Pengetahuan' : 'Back to Resources'}</Link>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden flex flex-col items-center pb-24 bg-background min-h-screen">
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] dark:opacity-[0.04] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--foreground) 1.5px, transparent 0)', backgroundSize: '40px 40px' }} 
      />
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[100%] md:w-[80%] h-[30%] rounded-full bg-blue-600/20 dark:bg-blue-600/20 blur-[120px] pointer-events-none" />

      {/* Header */}
      <section className="relative z-10 w-full max-w-4xl px-6 pt-40 pb-12 flex flex-col items-start">
        <Link href="/resources" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {resolvedParams.locale === 'id' ? 'Kembali ke Pusat Pengetahuan' : 'Back to Knowledge Base'}
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start gap-4"
        >
          <span className="inline-block text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider mb-2">
            {data.tag}
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            {data.title}
          </h1>
        </motion.div>
      </section>

      {/* Content Body */}
      <section className="relative z-10 w-full max-w-4xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-card border border-border p-8 md:p-12 rounded-3xl shadow-xl w-full"
        >
          {data.content}
        </motion.div>
      </section>
    </div>
  )
}
