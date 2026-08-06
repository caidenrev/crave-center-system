import { requireRole } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getTranslations } from "next-intl/server"
import { FinanceView, IncomeItem } from "@/components/finance/finance-view"
import { StatCard } from "@/components/admin/overview/stat-card"
import { DollarSign, CheckCircle2, Clock, Wallet } from "lucide-react"

export default async function AdminFinancePage(props: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  await requireRole(["ADMIN"])
  const t = await getTranslations("Finance")

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
    type: p.type === "DP" ? t("downPayment") : p.type === "PELUNASAN" ? t("fullPayment") : p.type,
    status: p.status,
    date: p.createdAt.toISOString()
  }))

  const totalIncome = incomes.reduce((acc, curr) => {
    if (curr.status === "SUCCESS") return acc + curr.amount
    return acc
  }, 0)

  const successCount = incomes.filter(i => i.status === "SUCCESS").length;
  const pendingCount = incomes.filter(i => i.status === "PENDING").length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("adminTitle")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {t("adminSubtitle")}
        </p>
      </div>

      <div className="mb-4 md:mb-6">
        <StatCard
          title={t("totalRevenue")}
          value={new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(totalIncome)}
          badgeIcon={DollarSign}
          badgeText={t("projectValue")}
          variant="primary"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <StatCard
          title={t("totalCompletedProjects")}
          value={incomes.length}
          badgeIcon={Wallet}
          badgeText={t("allHistory")}
        />
        <StatCard
          title={t("payoutSuccess")}
          value={successCount}
          badgeIcon={CheckCircle2}
          badgeText={t("completed")}
        />
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            title={t("payoutPending")}
            value={pendingCount}
            badgeIcon={Clock}
            badgeText={t("outstanding")}
          />
        </div>
      </div>

      <FinanceView incomes={incomes} title={t("incomeHistoryTitle")} />
    </div>
  )
}
