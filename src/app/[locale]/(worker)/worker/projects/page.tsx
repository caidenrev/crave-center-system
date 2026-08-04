import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { WorkerProjectsClient } from "@/components/worker/worker-projects-client";

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
      },
      orderBy: { updatedAt: "desc" },
    })
    .catch(() => []);

  const serializedProjects = projects.map((p: any) => {
    const totalTasks = p.tasks?.length || 0;
    const doneTasks = p.tasks?.filter((t: any) => t.status === "DONE").length || 0;
    const progress =
      totalTasks > 0
        ? Math.round((doneTasks / totalTasks) * 100)
        : p.status === "COMPLETED"
        ? 100
        : 0;

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

