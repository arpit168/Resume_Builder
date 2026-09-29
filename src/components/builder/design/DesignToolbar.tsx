"use client";

import { Resume } from "@/types/resume";
import {
  ArrowLeft,
  Undo,
  Redo,
  RotateCcw,
  CheckCircle,
  Save,
} from "lucide-react";
import { useToastStore } from "@/store/toastStore";
import Link from "next/link";

interface DesignToolbarProps {
  resume: Resume;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function DesignToolbar({
  resume,
  onUndo,
  onRedo,
  onReset,
  canUndo,
  canRedo,
}: DesignToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 shrink-0 h-16 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Link
          href={`/builder/${resume.id}`}
          className="p-2 -ml-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
          title="Back to Content Editor"
          aria-label="Back to Content Editor"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-none">
            {resume.name}
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Design Mode
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 bg-gray-50/50 dark:bg-neutral-900/50 p-1 rounded-xl border border-gray-200/50 dark:border-neutral-800/50">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 transition-all rounded-lg ${canUndo ? "text-gray-700 hover:text-gray-900 hover:bg-white hover:shadow-sm dark:text-gray-300 dark:hover:text-white dark:hover:bg-neutral-800" : "text-gray-300 dark:text-neutral-700 cursor-not-allowed"}`}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 transition-all rounded-lg ${canRedo ? "text-gray-700 hover:text-gray-900 hover:bg-white hover:shadow-sm dark:text-gray-300 dark:hover:text-white dark:hover:bg-neutral-800" : "text-gray-300 dark:text-neutral-700 cursor-not-allowed"}`}
          title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
          aria-label="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-gray-200 dark:bg-neutral-800 mx-1" />
        <button
          onClick={() => {
            if (confirm("Are you sure you want to reset all design changes?")) {
              onReset();
              useToastStore
                .getState()
                .addToast("Design reset to default", "info");
            }
          }}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-white hover:shadow-sm dark:hover:text-red-400 dark:hover:bg-neutral-800 transition-all rounded-lg"
          title="Reset All Designs"
          aria-label="Reset All Designs"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Auto-save indicator — design is persisted automatically to localStorage via Zustand */}
        <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1.5 rounded-full">
          <Save className="w-3.5 h-3.5" />
          <span>Auto-saved</span>
        </div>
        <Link
          href={`/builder/${resume.id}`}
          className="flex items-center gap-2 text-sm px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md transform hover:scale-[1.02]"
          title="Return to Content Editor"
        >
          <span className="hidden sm:inline">Done Editing</span>
          <CheckCircle className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
