import { requireRole } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { FinanceView, IncomeItem } from "@/components/finance/finance-view"
import { StatCard } from "@/components/admin/overview/stat-card"
import { DollarSign, CheckCircle2, Clock, Wallet } from "lucide-react"

export default async function AdminFinancePage(props: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  await requireRole(["ADMIN"])

  // Fetch all successful/completed projects and all payments
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { project: { include: { client: true } } }
  })

  const incomes: IncomeItem[] = payments.map((p) => ({
    id: p.id,
    projectId: p.projectId,
    projectTitle: p.project?.title || "Unknown Project",
    amount: Number(p.amount),
    type: p.type === "DP" ? "Down Payment" : p.type === "PELUNASAN" ? "Pelunasan" : p.type,
    status: p.status,
    date: p.createdAt.toISOString()
  }))

  const totalIncome = incomes.reduce((acc, curr) => {
    if (curr.status === "SUCCESS" || curr.status === "PAID") return acc + curr.amount
    return acc
  }, 0)

  const successCount = incomes.filter(i => i.status === "SUCCESS" || i.status === "PAID").length;
  const pendingCount = incomes.filter(i => i.status === "PENDING").length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Detail Pemasukan (Admin)
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Metrik real-time, riwayat transaksi pembayaran proyek, dan ringkasan pendapatan dari Crave ITSM.
        </p>
      </div>

      <div className="mb-4 md:mb-6">
        <StatCard
          title="Total Pendapatan"
          value={`Rp ${totalIncome.toLocaleString("id-ID")}`}
          badgeIcon={DollarSign}
          badgeText="Project Value"
          variant="primary"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatCard
          title="Total Transaksi"
          value={incomes.length}
          badgeIcon={Wallet}
          badgeText="Semua Riwayat"
        />
        <StatCard
          title="Transaksi Sukses"
          value={successCount}
          badgeIcon={CheckCircle2}
          badgeText="Completed"
        />
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            title="Transaksi Pending"
            value={pendingCount}
            badgeIcon={Clock}
            badgeText="Outstanding"
          />
        </div>
      </div>

      <FinanceView incomes={incomes} title="Riwayat Pembayaran Klien" />
    </div>
  )
}
