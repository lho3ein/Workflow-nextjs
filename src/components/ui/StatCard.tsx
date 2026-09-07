import React from "react";
import { formatNumber } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: "slate" | "emerald" | "blue" | "amber" | "red" | "purple" | "sky";
}

const colors = {
  slate: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    gradient: "from-slate-500 to-slate-700",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    gradient: "from-emerald-500 to-emerald-600",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    gradient: "from-blue-500 to-blue-600",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    gradient: "from-amber-500 to-amber-600",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-600",
    gradient: "from-red-500 to-red-600",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    gradient: "from-purple-500 to-purple-600",
  },
  sky: {
    bg: "bg-sky-100",
    text: "text-sky-600",
    gradient: "from-sky-500 to-sky-600",
  },
};

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const c = colors[color];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-l ${c.gradient}`} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{formatNumber(value)}</p>
        </div>
        <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${c.bg} ${c.text}`}>
          <i className={`${icon} text-xl`} />
        </span>
      </div>
    </div>
  );
}