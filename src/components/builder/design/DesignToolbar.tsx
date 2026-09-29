"use client";

import { Resume } from "@/types/resume";
import { ArrowLeft, Undo, Redo, RotateCcw, CheckCircle } from "lucide-react";
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
    <div className="flex items-center justify-between p-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shrink-0 h-16">
      <div className="flex items-center gap-4">
        <Link
          href={`/builder/${resume.id}`}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Back to Content Editor"
          aria-label="Back to Content Editor"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-none">
            {resume.name}
          </h1>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Design Mode
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 transition-colors rounded-lg ${canUndo ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800" : "text-gray-300 dark:text-gray-700 cursor-not-allowed"}`}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 transition-colors rounded-lg ${canRedo ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800" : "text-gray-300 dark:text-gray-700 cursor-not-allowed"}`}
          title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
          aria-label="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
        <button
          onClick={() => {
            if (confirm("Are you sure you want to reset all design changes?")) {
              onReset();
            }
          }}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors rounded-lg"
          title="Reset All Designs"
          aria-label="Reset All Designs"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Auto-save indicator — design is persisted automatically to localStorage via Zustand */}
        <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Auto-saved</span>
        </div>
        <Link
          href={`/builder/${resume.id}`}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium shadow-sm"
          title="Return to Content Editor"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Editor</span>
        </Link>
      </div>
    </div>
  );
}
