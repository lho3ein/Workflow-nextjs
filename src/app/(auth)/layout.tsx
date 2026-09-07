import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 text-2xl text-white shadow-lg">
            <i className="fa-solid fa-diagram-project" />
          </div>
          <h1 className="text-2xl font-bold text-white">سیستم گردش کار</h1>
          <p className="mt-2 text-sm text-slate-400">
            مدیریت فرآیندها و تسک‌های سازمانی
          </p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-2xl">{children}</div>
      </div>
    </div>
  );
}