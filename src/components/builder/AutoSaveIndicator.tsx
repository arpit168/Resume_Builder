"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface AutoSaveIndicatorProps {
  updatedAt: string;
}

export function AutoSaveIndicator({ updatedAt }: AutoSaveIndicatorProps) {
  const [status, setStatus] = useState("Saved just now");

  useEffect(() => {
    if (!updatedAt) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("Saved just now");

    const timer1 = setTimeout(() => {
      setStatus("Saved recently");
    }, 10000); // after 10s

    return () => {
      clearTimeout(timer1);
    };
  }, [updatedAt]);

  return (
    <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-500 font-medium bg-green-50 dark:bg-green-900/20 px-2.5 py-1.5 rounded-full transition-all">
      <Check className="w-3.5 h-3.5" />
      <span>{status}</span>
    </div>
  );
}
