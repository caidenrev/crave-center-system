import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { WorkerContractsView, WorkerContractItem } from "@/components/worker/contracts/worker-contracts-view";

export default async function WorkerContractsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  await requireRole(["TEAM_MEMBER"]);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser) return null;

  const t = await getTranslations("WorkerDashboard");

  // Fetch all terms/contracts for projects assigned to this worker
  const projectsWithTerms = await prisma.project
    .findMany({
      where: {
        workerId: dbUser.id,
        terms: { isNot: null },
      },
      include: {
        client: true,
        terms: true,
        contracts: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    })
    .catch(() => []);

  const serializedContracts: WorkerContractItem[] = projectsWithTerms.map((p) => ({
    id: p.terms?.id || p.id,
    projectId: p.id,
    projectTitle: p.title,
    projectStatus: p.status,
    clientName: p.client?.name || "Client",
    clientEmail: p.client?.email || undefined,
    priceFinal: Number(p.terms?.priceFinal || 0),
    scope: p.terms?.scope || null,
    approvedByClient: p.terms?.approvedByClient || false,
    signedAt: p.contracts?.[0]?.signedAt ? p.contracts[0].signedAt.toISOString() : null,
    contractDocumentUrl: p.contracts?.[0]?.contractDocumentUrl || null,
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Kontrak & Terms Proyek
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Daftar dokumen syarat, scope pekerjaan, dan kontrak proyek yang telah disepakati.
        </p>
      </div>

      <WorkerContractsView contracts={serializedContracts} />
    </div>
  );
}
