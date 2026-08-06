import { requireRole } from "@/lib/auth";
import { AdminLayoutShell } from "@/components/layout/admin-layout-shell";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

export default async function AdminLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  await requireRole(["ADMIN"]);
  const messages = await getMessages();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  }

  const topbarUser = user
    ? {
        id: user.id,
        name:
          dbUser?.name ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "Crave Admin",
        email: user.email || "admin@crave.com",
        image:
          dbUser?.image || user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      }
    : null;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AdminLayoutShell locale={locale} topbarUser={topbarUser}>
        {props.children}
      </AdminLayoutShell>
    </NextIntlClientProvider>
  );
}
