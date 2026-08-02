import { requireRole } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { ClientTopbar } from "@/components/layout/client-topbar";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";

export default async function AdminLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  await requireRole(["ADMIN"]);
  const { locale } = await props.params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  }
  
  const topbarUser = user ? {
    id: user.id,
    name: dbUser?.name || user.user_metadata?.full_name || user.user_metadata?.name || null,
    email: user.email || null,
    image: user.user_metadata?.avatar_url || user.user_metadata?.picture || null
  } : null;

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      <AdminSidebar locale={locale} />
      <div className="flex-1 flex flex-col min-w-0">
        <ClientTopbar user={topbarUser} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl">
            {props.children}
          </div>
        </main>
      </div>
    </div>
  );
}
