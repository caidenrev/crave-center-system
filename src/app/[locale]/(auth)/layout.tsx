import type { Metadata } from "next";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
export const metadata: Metadata = {
  title: "Autentikasi - Crave ITSM",
  description: "Masuk atau daftar ke Crave ITSM Platform",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center py-12 bg-zinc-50 relative overflow-x-hidden overflow-y-auto dark:bg-zinc-950">
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      {/* Decorative background pattern (Glassmorphism & Gradients) */}
      <div 
        className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} 
      />
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-violet-500/20 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-4 md:p-6 mt-0 md:-mt-12">
        {children}
      </div>
    </div>
  );
}
