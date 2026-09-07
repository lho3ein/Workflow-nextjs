"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("ایمیل یا رمز عبور اشتباه است.");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("خطا در ورود به سیستم.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-center text-xl font-bold text-slate-800">ورود به حساب کاربری</h2>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <i className="fa-solid fa-circle-exclamation" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            ایمیل <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <i className="fa-solid fa-envelope text-sm" />
            </span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 bg-white pr-10 pl-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="email@workflow.com"
              dir="ltr"
              style={{ textAlign: "left" }}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            رمز عبور <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <i className="fa-solid fa-lock text-sm" />
            </span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 bg-white pr-10 pl-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="رمز عبور را وارد کنید"
              dir="ltr"
              style={{ textAlign: "left" }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              در حال ورود...
            </>
          ) : (
            <>
              <i className="fa-solid fa-right-to-bracket" />
              ورود
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        حساب کاربری ندارید؟{" "}
        <Link
          href="/register"
          className="font-medium text-slate-800 transition hover:text-slate-600 hover:underline"
        >
          ثبت‌نام کنید
        </Link>
      </p>

      <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
        <p className="mb-1 font-medium text-slate-700">حساب‌های نمونه:</p>
        <div className="space-y-1">
          <p>admin@workflow.com / password</p>
          <p>manager@workflow.com / password</p>
          <p>supervisor@workflow.com / password</p>
        </div>
      </div>
    </div>
  );
}