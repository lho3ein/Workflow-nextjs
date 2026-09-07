"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let idCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast]
  );

  const success = useCallback((m: string) => showToast("success", m), [showToast]);
  const error = useCallback((m: string) => showToast("error", m), [showToast]);

  const icons: Record<ToastType, string> = {
    success: "fa-solid fa-circle-check",
    error: "fa-solid fa-circle-xmark",
    info: "fa-solid fa-circle-info",
  };

  const colors: Record<ToastType, string> = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-sky-50 border-sky-200 text-sky-800",
  };

  const iconColors: Record<ToastType, string> = {
    success: "text-emerald-500",
    error: "text-red-500",
    info: "text-sky-500",
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error }}>
      {children}
      <div className="fixed bottom-4 left-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${colors[t.type]} animate-[toast-in_.3s_ease-out]`}
            role="alert"
          >
            <i className={`text-lg ${icons[t.type]} ${iconColors[t.type]}`} />
            <span className="text-sm font-medium">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="mr-2 text-sm opacity-50 transition hover:opacity-100"
              aria-label="بستن"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}