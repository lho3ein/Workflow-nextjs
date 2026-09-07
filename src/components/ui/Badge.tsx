import React from "react";

type BadgeTone = "gray" | "green" | "amber" | "red" | "blue" | "sky" | "purple";

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const tones: Record<BadgeTone, string> = {
  gray: "bg-slate-100 text-slate-600 border-slate-200",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  sky: "bg-sky-50 text-sky-700 border-sky-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function Badge({
  children,
  tone = "gray",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}