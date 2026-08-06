import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { WorkerDeliverablesClient } from "@/components/worker/deliverables/worker-deliverables-client";

export default async function WorkerDeliverablesPage(props: {
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

  const t = await getTranslations("WorkerDeliverables");

  // Fetch deliverables uploaded by this worker OR for projects assigned to this worker
  const deliverables = await prisma.deliverable
    .findMany({
      where: { uploadedById: dbUser.id },
      include: {
        project: {
          select: { title: true, client: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  // Deduplicate: Keep only the latest deliverable per project
  const uniqueDeliverablesMap = new Map();
  for (const del of deliverables) {
    if (!uniqueDeliverablesMap.has(del.projectId)) {
      let cleanUrl = del.fileUrl;
      if (cleanUrl && cleanUrl.includes("/storage/v1/object/public/deliverables/")) {
        cleanUrl = cleanUrl.replace("/storage/v1/object/public/deliverables/", "/storage/v1/object/public/avatars/");
      }
      uniqueDeliverablesMap.set(del.projectId, {
        id: del.id,
        projectId: del.projectId,
        projectTitle: del.project?.title || "Unknown Project",
        clientName: del.project?.client?.name || "Unknown",
        fileUrl: cleanUrl,
        description: del.description,
        status: del.status,
        createdAt: del.createdAt.toISOString(),
      });
    }
  }
  const serializedDeliverables = Array.from(uniqueDeliverablesMap.values());

  // Fetch active projects assigned to this worker
  const activeProjects = await prisma.project
    .findMany({
      where: {
        workerId: dbUser.id,
        status: { in: ["IN_PROGRESS", "WORKER_REVIEW", "PENDING_DP"] },
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: { updatedAt: "desc" },
    })
    .catch(() => []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("title")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {t("subtitle")}
        </p>
      </div>

      <WorkerDeliverablesClient 
        deliverables={serializedDeliverables} 
        activeProjects={activeProjects}
      />
    </div>
  );
}
