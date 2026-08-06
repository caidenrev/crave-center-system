import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { ClientDeliverablesView } from "@/components/client/deliverables/client-deliverables-view";

export default async function ClientDeliverablesPage() {
  await requireRole(["CLIENT"]);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser) return null;

  // Fetch deliverables for projects owned by this client
  const deliverables = await prisma.deliverable.findMany({
    where: {
      project: {
        clientId: dbUser.id,
      },
    },
    include: {
      project: {
        select: {
          title: true,
        },
      },
      uploadedBy: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

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
        projectTitle: del.project.title,
        clientName: del.uploadedBy.name,
        fileUrl: cleanUrl,
        description: del.description,
        status: del.status,
        createdAt: del.createdAt.toISOString(),
      });
    }
  }
  const serializedDeliverables = Array.from(uniqueDeliverablesMap.values());

  return <ClientDeliverablesView deliverables={serializedDeliverables} />;
}
