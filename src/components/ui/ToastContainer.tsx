"use client";

import { useToastStore } from "@/store/toastStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border pointer-events-auto transition-all duration-300 transform translate-y-0 opacity-100 ${
            toast.type === "error"
              ? "bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
              : toast.type === "success"
                ? "bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
          }`}
        >
          {toast.type === "error" && (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          {toast.type === "success" && (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          )}
          {toast.type === "info" && <Info className="w-5 h-5 text-blue-500" />}

          <p className="text-sm font-medium pr-6">{toast.message}</p>

          <button
            onClick={() => removeToast(toast.id)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-50 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
