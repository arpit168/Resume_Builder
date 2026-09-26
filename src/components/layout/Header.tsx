"use client";

import Link from "next/link";
import { FileText, Moon, Sun, MessageSquarePlus } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";
import { FeedbackModal } from "../FeedbackModal";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#F8FAFC]/80 dark:bg-[#0B0F19]/80 backdrop-blur-md print:hidden border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white"
          >
            <FileText className="w-6 h-6 text-blue-500" />
            <span>HireCraft</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Give Feedback"
            >
              <MessageSquarePlus size={20} />
              <span className="hidden sm:inline">Feedback</span>
            </button>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700/50 transition-all"
                aria-label="Toggle theme"
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-full font-medium text-sm transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Dash</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
}
