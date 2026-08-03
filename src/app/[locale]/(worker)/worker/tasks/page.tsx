import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { WorkerTasksClient } from "@/components/worker/worker-tasks-client";

export default async function WorkerTasksPage(props: {
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

  const tasks = await prisma.task
    .findMany({
      where: { assigneeId: dbUser.id },
      include: {
        project: {
          select: { title: true, client: { select: { name: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
    })
    .catch(() => []);

  const activeProjects = await prisma.project
    .findMany({
      where: {
        workerId: dbUser.id,
        status: { notIn: ["COMPLETED", "CANCELLED"] }
      },
      select: { id: true, title: true }
    })
    .catch(() => []);

  const serializedTasks = tasks.map((task: any) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    projectTitle: task.project?.title || "Unknown Project",
    clientName: task.project?.client?.name || "Unknown",
    estimatedTime: task.estimatedTime,
    actualTime: task.actualTime,
    deadline: task.deadline ? task.deadline.toISOString() : null,
    completedAt: task.completedAt ? task.completedAt.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("activeTasks")}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {t("taskBreakdown")}
        </p>
      </div>

      <WorkerTasksClient
        tasks={serializedTasks}
        activeProjects={activeProjects}
      />
    </div>
  );
}
