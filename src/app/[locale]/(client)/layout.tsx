import { requireRole } from "@/lib/auth";
import { ClientShell } from "@/components/layout/client-shell";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

export default async function ClientLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  await requireRole(["CLIENT"]);
  const messages = await getMessages();
  
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
    image: dbUser?.image || user.user_metadata?.avatar_url || user.user_metadata?.picture || null
  } : null;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ClientShell locale={locale} user={topbarUser}>
        {props.children}
      </ClientShell>
    </NextIntlClientProvider>
  );
}
