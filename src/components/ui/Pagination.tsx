"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatNumber } from "@/lib/utils";

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  perPage: number;
}

export default function Pagination({
  totalItems,
  currentPage,
  perPage,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  if (totalPages <= 1) return null;

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
      <p className="text-xs text-slate-500">
        نمایش {formatNumber((currentPage - 1) * perPage + 1)} تا{" "}
        {formatNumber(Math.min(currentPage * perPage, totalItems))} از{" "}
        {formatNumber(totalItems)} مورد
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="قبلی"
        >
          <i className="fa-solid fa-chevron-right text-xs" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e-${i}`} className="px-1 text-xs text-slate-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => changePage(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${
                p === currentPage
                  ? "bg-slate-800 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {formatNumber(p)}
            </button>
          )
        )}

        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="بعدی"
        >
          <i className="fa-solid fa-chevron-left text-xs" />
        </button>
      </div>
    </div>
  );
}