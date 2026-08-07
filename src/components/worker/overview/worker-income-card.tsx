import { getTranslations } from "next-intl/server";
import { Wallet, ArrowRight } from "lucide-react";
import Link from "next/link";

interface WorkerIncomeItem {
  id: string;
  amount: number;
  type: string;
  status: string;
  project: { title: string };
}

const statusStyles: Record<string, string> = {
  SUCCESS: "text-white bg-emerald-500",
  PENDING: "text-white bg-amber-500",
};

export async function WorkerIncomeCard({
  incomes,
  locale = "id",
}: {
  incomes: WorkerIncomeItem[];
  locale?: string;
}) {
  const t = await getTranslations("WorkerDashboard");

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm h-full flex flex-col group relative">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {t("lastIncomes")}
        </h3>
        <Link 
          href={`/${locale}/worker/finance`}
          className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          {t("detail")} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="space-y-3 flex-1 relative z-10">
        {incomes.map((income) => (
          <div
            key={income.id}
            className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {income.project.title}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  {income.type}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(income.amount)}
              </p>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 inline-block ${
                  statusStyles[income.status] || "text-emerald-600 bg-emerald-500/10"
                }`}
              >
                {income.status}
              </span>
            </div>
          </div>
        ))}

        {incomes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-50 py-4">
            <Wallet className="w-8 h-8 mb-2" />
            <p className="text-xs font-medium">{t("noIncomes")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
