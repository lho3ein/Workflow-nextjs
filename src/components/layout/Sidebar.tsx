"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { canManageDepartments, canManageWorkflows, canManageTasks } from "@/lib/rbac";
import { useDashboardContext } from "../context/DashboardContext";

interface SidebarProps {
   session: Session | null;
}

const baseLinkClass = "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150";

export default function Sidebar({ session }: SidebarProps) {
   const { sideOpen, setSideOpen } = useDashboardContext();
   const pathname = usePathname();
   if (!session) return null;

   const role = session.user.role;

   const isActive = (path: string) => {
      if (path === "/dashboard") return pathname === "/dashboard";
      return pathname.startsWith(path);
   };

   const linkClass = (path: string) => `${baseLinkClass} ${isActive(path) ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`;

   return (
      <>
         <aside className={`fixed inset-x-0 top-0 z-40 flex h-screen w-64 ${sideOpen ? "translate-x-0" : "translate-x-full"} flex-col overflow-y-auto bg-slate-900 transition-transform duration-300 lg:translate-x-0 lg:fixed lg:w-64 xl:w-72" id="sidebar`}>
            {/* For Dekstop  */}
            <div className="hidden lg:flex items-center gap-3 border-b border-white/10 px-6 py-5">
               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-slate-600 to-slate-800 text-lg text-white">
                  <i className="fa-solid fa-diagram-project" />
               </div>
               <div>
                  <h1 className="text-base font-bold text-white">سیستم گردش کار</h1>
                  <p className="text-xs text-slate-400">مدیریت فرآیندها و تسک‌ها</p>
               </div>
            </div>

            {/* For Mobile  */}
            <nav className="flex-1 space-y-1 px-4 py-6">
               <div className="flex mb-5 px-2 text-xs font-medium">
                  <p className="self-center text-slate-300"> منوی اصلی</p>

                  <button onClick={() => setSideOpen(false)} className="flex h-8 w-8 mr-auto cursor-pointer lg:hidden items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-700 hover:text-slate-400">
                     <i className="fa-solid fa-xmark" />
                  </button>
               </div>

               <Link href="/dashboard" className={linkClass("/dashboard")}>
                  <i className="fa-solid fa-gauge-high w-5 text-center" />
                  داشبورد
               </Link>

               {canManageDepartments(role) && (
                  <Link href="/departments" className={linkClass("/departments")}>
                     <i className="fa-solid fa-building-columns w-5 text-center" />
                     دپارتمان‌ها
                  </Link>
               )}

               {canManageWorkflows(role) && (
                  <Link href="/workflows" className={linkClass("/workflows")}>
                     <i className="fa-solid fa-diagram-project w-5 text-center" />
                     گردش کارها
                  </Link>
               )}

               {canManageTasks(role) && (
                  <Link href="/tasks" className={linkClass("/tasks")}>
                     <i className="fa-solid fa-list-check w-5 text-center" />
                     تسک‌ها
                  </Link>
               )}
            </nav>

            <div className="border-t border-white/10 p-4">
               <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-slate-500 to-slate-700 text-sm font-bold text-white">{session.user.name?.charAt(0) || "U"}</div>
                  <div className="min-w-0">
                     <p className="truncate text-sm font-medium text-white">{session.user.name}</p>
                     <p className="truncate text-xs text-slate-400">{session.user.email}</p>
                  </div>
               </div>
            </div>
         </aside>
         {/* Overlaye  */}
         <div onClick={() => setSideOpen(false)} className={`fixed inset-0 z-30 bg-ink-950/30 backdrop-blur-sm ${sideOpen ? "block" : "hidden"}`}></div>
      </>
   );
}
