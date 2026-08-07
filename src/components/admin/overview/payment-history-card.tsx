import { getTranslations } from "next-intl/server";
import { Wallet, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PaymentItem {
  id: string;
  amount: any; // Prisma Decimal
  type: string;
  status: string;
  project: { client: { name: string | null } };
}

const statusStyles: Record<string, string> = {
  SUCCESS: "text-white bg-emerald-500",
  PENDING: "text-white bg-amber-500",
};

export async function PaymentHistoryCard({
  payments,
  locale = "id",
}: {
  payments: PaymentItem[];
  locale?: string;
}) {
  const t = await getTranslations("AdminDashboard");

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm h-full flex flex-col group relative">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {t("paymentHistory")}
        </h3>
        <Link 
          href={`/${locale}/admin/finance`}
          className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          Lihat Detail <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="space-y-3 flex-1 relative z-10">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="truncate">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {payment.project.client.name}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  {payment.type}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Rp{Number(payment.amount).toLocaleString("id-ID")}
              </p>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 inline-block ${
                  statusStyles[payment.status] || "text-rose-600 bg-rose-500/10"
                }`}
              >
                {payment.status}
              </span>
            </div>
          </div>
        ))}

        {payments.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-50 py-4">
            <Wallet className="w-8 h-8 mb-2" />
            <p className="text-xs font-medium">{t("noRecentPayments")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
