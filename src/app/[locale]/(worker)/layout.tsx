import { requireRole } from "@/lib/auth";
import Link from "next/link";

export default async function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["TEAM_MEMBER", "ADMIN"]);

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950">
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 hidden md:block">
        <h2 className="font-bold text-xl mb-6 tracking-tight text-zinc-900 dark:text-white">Worker Hub</h2>
        <nav className="space-y-2">
          <Link href="/worker-dashboard" className="block px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300">Tugas Saya</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
