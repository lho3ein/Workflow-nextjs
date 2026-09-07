"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { canManageDepartments, canManageWorkflows, canManageTasks } from "@/lib/rbac";

interface SidebarProps {
  session: Session | null;
}

const baseLinkClass =
  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150";

export default function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname();
  if (!session) return null;

  const role = session.user.role;

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const linkClass = (path: string) =>
    `${baseLinkClass} ${
      isActive(path)
        ? "bg-white/10 text-white"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <aside className="fixed inset-x-0 top-0 z-30 flex h-full w-64 -translate-x-full flex-col overflow-y-auto bg-slate-900 pt-16 transition-transform duration-300 lg:translate-x-0 lg:static lg:w-64 xl:w-72" id="sidebar">
      <div className="hidden lg:flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 text-lg text-white">
          <i className="fa-solid fa-diagram-project" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white">سیستم گردش کار</h1>
          <p className="text-xs text-slate-400">مدیریت فرآیندها و تسک‌ها</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        <p className="mb-2 px-2 text-xs font-medium text-slate-500">منوی اصلی</p>

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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-700 text-sm font-bold text-white">
            {session.user.name?.charAt(0) || "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{session.user.name}</p>
            <p className="truncate text-xs text-slate-400">{session.user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}