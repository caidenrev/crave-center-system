import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { WorkerProjectsClient } from "@/components/worker/projects/worker-projects-client";

export default async function WorkerProjectsPage(props: {
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

  const projects = await prisma.project
    .findMany({
      where: {
        workerId: dbUser.id,
        status: { not: "REQUESTED" },
      },
      include: {
        client: true,
        tasks: true,
        terms: true,
      },
      orderBy: { updatedAt: "desc" },
    })
    .catch(() => []);

  const serializedProjects = projects.map((p: any) => {
    const totalTasks = p.tasks?.length || 0;
    const doneTasks = p.tasks?.filter((t: any) => t.status === "DONE").length || 0;
    let progress = 0;
    if (totalTasks > 0) {
      const taskPct = Math.round((doneTasks / totalTasks) * 100);
      progress = p.status === "IN_PROGRESS" ? Math.max(50, Math.min(95, taskPct)) : taskPct;
    } else {
      switch (p.status) {
        case "REQUESTED": progress = 10; break;
        case "WORKER_REVIEW": progress = 25; break;
        case "PENDING_DP": progress = 40; break;
        case "IN_PROGRESS": progress = 65; break;
        case "ON_HOLD": progress = 65; break;
        case "COMPLETED": progress = 100; break;
        case "IN_WARRANTY": progress = 100; break;
        default: progress = 0; break;
      }
    }

    return {
      id: p.id.split("-")[0].toUpperCase(),
      fullId: p.id,
      name: p.title,
      client: p.client?.name || "Client",
      status: p.status,
      progress,
      dueDate: p.targetDeliveryDate
        ? new Date(p.targetDeliveryDate).toLocaleDateString()
        : "TBD",
      description: p.description,
      briefFileUrl: p.briefFileUrl,
      offeredPrice: p.offeredPrice ? Number(p.offeredPrice) : null,
      offeredDuration: p.offeredDuration || null,
      terms: p.terms
        ? {
            id: p.terms.id,
            scope: p.terms.scope,
            priceFinal: Number(p.terms.priceFinal || 0),
            status: p.terms.status,
            approvedByClient: p.terms.approvedByClient,
          }
        : null,
      totalTasks,
      doneTasks,
      budget: p.budgetRange || undefined,
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("myActiveProjects")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {t("viewAllProjects")}
        </p>
      </div>

      <WorkerProjectsClient projects={serializedProjects} currentUserId={dbUser.id} />
    </div>
  );
}

