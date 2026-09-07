"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error || "خطا در ثبت‌نام");
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطا در ثبت‌نام");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-center text-xl font-bold text-slate-800">ایجاد حساب کاربری</h2>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <i className="fa-solid fa-circle-exclamation" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            نام <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <i className="fa-solid fa-user text-sm" />
            </span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className={`w-full rounded-lg border ${errors.name ? "border-red-400" : "border-slate-300"} bg-white pr-10 pl-3.5 py-2.5 text-sm text-slate-800 transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300`}
              placeholder="نام کامل را وارد کنید"
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

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
              className={`w-full rounded-lg border ${errors.email ? "border-red-400" : "border-slate-300"} bg-white pr-10 pl-3.5 py-2.5 text-sm text-slate-800 transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300`}
              placeholder="email@example.com"
              dir="ltr"
              style={{ textAlign: "left" }}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
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
              className={`w-full rounded-lg border ${errors.password ? "border-red-400" : "border-slate-300"} bg-white pr-10 pl-3.5 py-2.5 text-sm text-slate-800 transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300`}
              placeholder="حداقل ۸ کاراکتر"
              dir="ltr"
              style={{ textAlign: "left" }}
            />
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            تایید رمز عبور <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <i className="fa-solid fa-lock text-sm" />
            </span>
            <input
              type="password"
              required
              value={form.password_confirmation}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password_confirmation: e.target.value }))
              }
              className={`w-full rounded-lg border ${errors.password_confirmation ? "border-red-400" : "border-slate-300"} bg-white pr-10 pl-3.5 py-2.5 text-sm text-slate-800 transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300`}
              placeholder="رمز عبور را دوباره وارد کنید"
              dir="ltr"
              style={{ textAlign: "left" }}
            />
          </div>
          {errors.password_confirmation && (
            <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>
          )}
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
              در حال ثبت‌نام...
            </>
          ) : (
            <>
              <i className="fa-solid fa-user-plus" />
              ثبت‌نام
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        قبلا ثبت‌نام کرده‌اید؟{" "}
        <Link
          href="/login"
          className="font-medium text-slate-800 transition hover:text-slate-600 hover:underline"
        >
          وارد شوید
        </Link>
      </p>
    </div>
  );
}