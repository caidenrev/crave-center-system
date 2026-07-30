import { requireRole } from "@/lib/auth";
import Link from "next/link";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["CLIENT"]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-6">
        <h2 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">Crave Client Portal</h2>
        <nav className="flex space-x-4">
          <Link href="/client-dashboard" className="text-sm font-medium hover:text-blue-600 transition-colors">Beranda</Link>
          <Link href="/orders" className="text-sm font-medium hover:text-blue-600 transition-colors">Pesanan Saya</Link>
          <Link href="/request" className="text-sm font-medium hover:text-blue-600 transition-colors">Buat Request</Link>
        </nav>
      </header>
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
