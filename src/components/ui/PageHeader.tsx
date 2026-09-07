import React from "react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export default function PageHeader({
  title,
  subtitle,
  icon,
  buttonLabel,
  buttonHref,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-slate-800 lg:text-2xl">
          {icon && <i className={`${icon} text-slate-400`} />}
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {buttonLabel && buttonHref && (
        <Link
          href={buttonHref}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1"
        >
          <i className="fa-solid fa-plus" />
          {buttonLabel}
        </Link>
      )}
    </div>
  );
}