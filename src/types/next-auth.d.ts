import { Role } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      departmentId: number | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
    departmentId: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    departmentId: number | null;
  }
}