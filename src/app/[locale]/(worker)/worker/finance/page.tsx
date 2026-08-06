import { requireRole } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createClient } from "@/utils/supabase/server"
import { getTranslations } from "next-intl/server"
import { FinanceView, IncomeItem } from "@/components/finance/finance-view"
import { Info, DollarSign, CheckCircle2, Clock, Wallet } from "lucide-react"
import { StatCard } from "@/components/admin/overview/stat-card"

export default async function WorkerFinancePage(props: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  await requireRole(["TEAM_MEMBER"])
  const t = await getTranslations("Finance")
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) return null
  const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!dbUser) return null

  // Ambil semua project yang sudah selesai untuk worker ini
  const completedProjects = await prisma.project.findMany({
    where: {
      workerId: dbUser.id,
      status: { in: ["COMPLETED", "IN_WARRANTY"] }
    },
    orderBy: { updatedAt: "desc" }
  })

  // Asumsi: Skema bagi hasil 70% Worker - 30% Platform
  const WORKER_SHARE_PERCENTAGE = 0.70;

  const incomes: IncomeItem[] = completedProjects.map((p) => ({
    id: p.id,
    projectId: p.id,
    projectTitle: p.title || "Unknown Project",
    amount: Number(p.offeredPrice || 0) * WORKER_SHARE_PERCENTAGE,
    type: "Project Revenue (70%)",
    status: "SUCCESS",
    date: p.updatedAt.toISOString()
  }))

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0)
  
  const successCount = incomes.filter(i => i.status === "SUCCESS").length;
  const pendingCount = incomes.filter(i => i.status === "PENDING").length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("workerTitle")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {t("workerSubtitle")}
        </p>
      </div>

      <div className="mb-4 md:mb-6">
        <StatCard
          title={t("netIncome")}
          value={new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(totalIncome)}
          badgeIcon={DollarSign}
          badgeText={t("netIncome")}
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

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex gap-3 text-blue-700 dark:text-blue-300">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm">
          <strong>{t("revenueShareInfoTitle")}</strong> {t("revenueShareInfoText")}
        </div>
      </div>

      <FinanceView incomes={incomes} title={t("incomeHistoryTitle")} />
    </div>
  )
}
