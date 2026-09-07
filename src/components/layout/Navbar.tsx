"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { roleLabels } from "@/lib/rbac";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return null;

  const role = session.user.role as keyof typeof roleLabels;

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      const isHidden = sidebar.classList.contains("-translate-x-full");
      if (isHidden) {
        sidebar.classList.remove("-translate-x-full");
      } else {
        sidebar.classList.add("-translate-x-full");
      }
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 lg:hidden"
          aria-label="منو"
        >
          <i className="fa-solid fa-bars text-lg" />
        </button>

        <div className="flex items-center gap-3 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 text-sm text-white">
            <i className="fa-solid fa-diagram-project" />
          </div>
          <span className="text-sm font-bold text-slate-800">سیستم گردش کار</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-slate-800">{session.user.name}</p>
          <p className="text-xs text-slate-500">{roleLabels[role]}</p>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden sm:block" />

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          title="خروج از حساب"
        >
          <i className="fa-solid fa-right-from-bracket" />
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>
    </header>
  );
}