"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = [
    {
      title: "GENERAL",
      shortcuts: [
        { keys: ["Ctrl", "S"], label: "Save Design" },
        { keys: ["Ctrl", "Z"], label: "Undo" },
        { keys: ["Ctrl", "Y"], label: "Redo" },
        { keys: ["Ctrl", "P"], label: "Print / Export" },
      ],
    },
    {
      title: "TEXT FORMATTING",
      shortcuts: [
        { keys: ["Ctrl", "B"], label: "Bold" },
        { keys: ["Ctrl", "I"], label: "Italic" },
        { keys: ["Ctrl", "U"], label: "Underline" },
      ],
    },
    {
      title: "CANVAS",
      shortcuts: [
        { keys: ["Ctrl", "+"], label: "Zoom In" },
        { keys: ["Ctrl", "-"], label: "Zoom Out" },
        { keys: ["Ctrl", "0"], label: "Reset Zoom" },
        { keys: ["Ctrl", "K"], label: "Command Palette" },
        { keys: ["Arrow Keys"], label: "Nudge Selected Element" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                {category.title}
              </h3>
              <ul className="space-y-3">
                {category.shortcuts.map((sc, i) => (
                  <li key={i} className="flex flex-col gap-1.5">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {sc.label}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sc.keys.map((k, j) => (
                        <span
                          key={j}
                          className="px-2 py-1 text-xs font-mono font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded shadow-sm"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
