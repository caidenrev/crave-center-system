import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function getUserRole() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser) {
    return null;
  }

  return dbUser.role; // "CLIENT" | "ADMIN" | "TEAM_MEMBER"
}

export async function requireRole(allowedRoles: ("CLIENT" | "ADMIN" | "TEAM_MEMBER")[]) {
  const role = await getUserRole();
  
  if (!role || !allowedRoles.includes(role as any)) {
    redirect("/login?error=UnauthorizedAccess");
  }
  
  return role;
}
