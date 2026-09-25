"use client";

import Link from "next/link";
import { FileText, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F8FAFC]/80 dark:bg-[#0B0F19]/80 backdrop-blur-md print:hidden border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
          <FileText className="w-6 h-6 text-blue-500" />
          <span>HireCraft</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
          <Link href="/" className="text-gray-900 dark:text-white relative py-2">
            Home
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></span>
          </Link>
          <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors py-2">Templates</Link>
          <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors py-2">Features</Link>
          <Link href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors py-2">About</Link>
        </nav>

        <div className="flex items-center gap-4">
          {mounted && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-800/50 rounded-full p-1 border border-gray-200 dark:border-gray-700/50">
              <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-full transition-all ${theme === "light" ? "text-blue-500" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                aria-label="Light mode"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-full transition-all ${theme === "dark" ? "text-blue-500" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                aria-label="Dark mode"
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <Link href="/dashboard" className="hidden sm:flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full font-medium text-sm transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            Dashboard
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
