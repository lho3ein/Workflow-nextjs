import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Providers from "@/components/providers/Provider";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/login");
   }

   return (
      <Providers>
         <div className="flex min-h-screen bg-slate-50">
            <Sidebar session={session} />
            <div className="flex lg:mr-64 xl:mr-72 min-w-0 flex-1 flex-col">
               <Navbar />
               <main className="flex-1 p-4 lg:p-6 mb-14 lg:mb-0">{children}</main>
            </div>
         </div>
      </Providers>
   );
}
