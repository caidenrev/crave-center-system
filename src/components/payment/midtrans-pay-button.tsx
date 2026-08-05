"use client";

import { useState } from "react";
import { initiatePayment } from "@/app/actions/payment";
import { PaymentType } from "@/generated/prisma";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MidtransPayButtonProps {
  projectId: string;
  amount: number;
  paymentType: PaymentType;
  buttonText?: string;
  className?: string;
  onSuccess?: () => void;
  onPending?: () => void;
  onError?: () => void;
  onClose?: () => void;
}

// Ensure you have added the snap script in layout.tsx:
// <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}></script>

export function MidtransPayButton({
  projectId,
  amount,
  paymentType,
  buttonText = "Bayar Sekarang",
  className = "",
  onSuccess,
  onPending,
  onError,
  onClose
}: MidtransPayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    try {
      setIsLoading(true);
      // 1. Get Snap Token from Server
      const result = await initiatePayment(projectId, amount, paymentType);
      
      if (!result?.token) {
        throw new Error("Gagal mendapatkan token pembayaran");
      }

      // 2. Open Snap UI
      if (typeof window !== "undefined" && (window as any).snap) {
        (window as any).snap.pay(result.token, {
          onSuccess: function (result: any) {
            toast.success("Pembayaran berhasil!");
            onSuccess?.();
          },
          onPending: function (result: any) {
            toast.info("Menunggu pembayaran diselesaikan.");
            onPending?.();
          },
          onError: function (result: any) {
            toast.error("Pembayaran gagal.");
            onError?.();
          },
          onClose: function () {
            toast.warning("Anda menutup popup pembayaran.");
            onClose?.();
          }
        });
      } else {
        toast.error("Sistem pembayaran belum siap, silakan muat ulang halaman.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <CreditCard className="w-4 h-4" />
      )}
      {isLoading ? "Memproses..." : buttonText}
    </button>
  );
}
