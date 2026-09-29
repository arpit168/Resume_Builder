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
        { keys: ["Ctrl", "Shift", "Z"], label: "Redo (Alternative)" },
        { keys: ["Ctrl", "P"], label: "Print / Export" },
        { keys: ["?", "/"], label: "Keyboard Shortcuts" },
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
      title: "CANVAS & ELEMENTS",
      shortcuts: [
        { keys: ["Ctrl", "+"], label: "Zoom In" },
        { keys: ["Ctrl", "-"], label: "Zoom Out" },
        { keys: ["Ctrl", "0"], label: "Reset Zoom" },
        { keys: ["Ctrl", "K"], label: "Command Palette" },
        { keys: ["Arrow Keys"], label: "Nudge Selected Element (2px)" },
        { keys: ["Shift", "Arrow Keys"], label: "Large Nudge (10px)" },
        {
          keys: ["Triple Click", "→", "Arrow Keys"],
          label: "Move ALL Elements Together",
        },
      ],
    },
    {
      title: "MOUSE ACTIONS",
      shortcuts: [
        { keys: ["Click"], label: "Select Element" },
        { keys: ["Double Click"], label: "Deselect Element" },
        {
          keys: ["Shift", "Enter"],
          label: "Select Parent Group (moves entire block)",
        },
        { keys: ["Triple Click"], label: "Select Entire Page" },
        { keys: ["Drag"], label: "Move Element" },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-black rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-neutral-900/50">
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

        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                          className="px-2 py-1 text-xs font-mono font-semibold bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded shadow-sm"
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
