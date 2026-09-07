import React from "react";

interface AlertProps {
  type: "success" | "error" | "info" | "warning";
  title?: string;
  children: React.ReactNode;
}

const styles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-sky-200 bg-sky-50 text-sky-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
};

const icons = {
  success: "fa-solid fa-circle-check text-emerald-500",
  error: "fa-solid fa-circle-xmark text-red-500",
  info: "fa-solid fa-circle-info text-sky-500",
  warning: "fa-solid fa-triangle-exclamation text-amber-500",
};

export default function Alert({ type, title, children }: AlertProps) {
  return (
    <div className={`mb-4 flex items-start gap-3 rounded-xl border px-4 py-3 ${styles[type]}`}>
      <i className={`mt-0.5 text-lg ${icons[type]}`} />
      <div className="text-sm">
        {title && <p className="font-bold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}