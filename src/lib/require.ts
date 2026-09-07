import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";
import { hasRole, isManager, isSupervisor } from "@/lib/rbac";
import type { Session } from "next-auth";

export async function requireAuth(): Promise<Session> {
   const session = await getServerSession(authOptions);
   if (!session) redirect("/login");
   return session;
}

export async function requireManager(): Promise<Session> {
   const session = await requireAuth();
   if (!isManager(session.user.role)) redirect("/dashboard");
   return session;
}

export async function requireSupervisor(): Promise<Session> {
   const session = await requireAuth();
   if (!isSupervisor(session.user.role)) redirect("/dashboard");
   return session;
}

export async function requireRole(role: Role): Promise<Session> {
   const session = await requireAuth();
   if (!hasRole(session.user.role, role)) {
      redirect("/dashboard");
   }
   return session;
}
