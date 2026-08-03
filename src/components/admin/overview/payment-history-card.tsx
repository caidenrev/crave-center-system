import { getTranslations } from "next-intl/server";
import { Wallet } from "lucide-react";

interface PaymentItem {
  id: string;
  amount: any; // Prisma Decimal
  type: string;
  status: string;
  project: { client: { name: string | null } };
}

const statusStyles: Record<string, string> = {
  SUCCESS: "text-emerald-600 bg-emerald-500/10",
  PENDING: "text-amber-600 bg-amber-500/10",
};

export async function PaymentHistoryCard({
  payments,
}: {
  payments: PaymentItem[];
}) {
  const t = await getTranslations("AdminDashboard");

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {t("paymentHistory")}
        </h3>
      </div>

      <div className="space-y-3 flex-1">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
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
