import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
   providers: [
      CredentialsProvider({
         name: "credentials",
         credentials: {
            email: { label: "ایمیل", type: "email" },
            password: { label: "رمز عبور", type: "password" },
         },
         async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
               return null;
            }

            const user = await prisma.user.findUnique({
               where: { email: credentials.email },
               include: { department: true },
            });

            if (!user) return null;

            const valid = await bcrypt.compare(credentials.password, user.password);
            if (!valid) return null;

            if (!user.isActive) return null;

            return {
               id: user.id.toString(),
               email: user.email,
               name: user.name,
               role: user.role,
               departmentId: user.departmentId,
               image: null,
            };
         },
      }),
   ],
   session: { strategy: "jwt" },
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            const enrichedUser = user as unknown as {
               role?: import("@prisma/client").Role;
               departmentId?: number | null;
            };
            token.role = enrichedUser.role ?? token.role ?? "user";
            token.departmentId = enrichedUser.departmentId ?? token.departmentId ?? null;
         }
         return token;
      },
      async session({ session, token }) {
         if (session.user) {
            session.user.id = token.sub as string;
            session.user.role = token.role;
            session.user.departmentId = token.departmentId;
         }
         return session;
      },
   },
   pages: {
      signIn: "/login",
      error: "/login",
   },
};
