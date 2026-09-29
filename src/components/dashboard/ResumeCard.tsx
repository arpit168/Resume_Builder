"use client";

import { useState, useRef, useEffect } from "react";
import { useResume } from "@/hooks/useResume";
import { Resume } from "@/types/resume";
import {
  FileText,
  Copy,
  Edit2,
  Trash2,
  MoreVertical,
  ExternalLink,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/toastStore";

export function ResumeCard({ resume }: { resume: Resume }) {
  const { deleteResume, duplicateResume, updateResume } = useResume();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(resume.name);
  const [showMenu, setShowMenu] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        setIsConfirmingDelete(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleDelete = () => {
    deleteResume(resume.id);
    useToastStore.getState().addToast("Resume deleted", "info");
  };

  const handleDuplicate = () => {
    duplicateResume(resume.id, `${resume.name} (Copy)`);
    useToastStore.getState().addToast("Resume duplicated", "success");
    setShowMenu(false);
  };

  const handleRename = () => {
    if (name.trim() && name !== resume.name) {
      updateResume(resume.id, { name: name.trim() });
      useToastStore
        .getState()
        .addToast("Resume renamed successfully", "success");
    } else {
      setName(resume.name);
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="group relative bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-[280px] transform hover:-translate-y-1">
      {/* Decorative Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div
        className="p-6 flex-grow cursor-pointer flex flex-col items-center justify-center text-center relative z-10"
        onClick={() => {
          if (!isEditing && !showMenu) {
            router.push(`/builder/${resume.id}`);
          }
        }}
      >
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-all duration-300 shadow-sm">
          <FileText className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="w-full px-2">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") {
                  setName(resume.name);
                  setIsEditing(false);
                }
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-lg font-bold bg-white dark:bg-neutral-950 border-2 border-blue-500 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-center"
              autoFocus
            />
          ) : (
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {resume.name}
            </h3>
          )}
        </div>

        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize mt-2 flex items-center gap-1.5 bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          {resume.template}
        </p>
      </div>

      <div className="px-5 py-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between bg-gray-50/50 dark:bg-neutral-950/50">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Edited {formatDate(resume.updatedAt)}
        </div>

        <div className="flex items-center gap-0.5">
          <Link
            href={`/builder/${resume.id}`}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-neutral-800 rounded-lg transition-all"
            title="Open Editor"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
                setIsConfirmingDelete(false);
              }}
              className={`p-2 rounded-lg transition-all ${showMenu ? "bg-gray-200 dark:bg-neutral-800 text-gray-900 dark:text-white" : "text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-neutral-800"}`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 bottom-[calc(100%+8px)] w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-800 py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {!isConfirmingDelete ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" /> Rename
                    </button>
                    <button
                      onClick={handleDuplicate}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-500" /> Duplicate
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-neutral-800 my-1 mx-2" />
                    <button
                      onClick={() => setIsConfirmingDelete(true)}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" /> Delete
                    </button>
                  </>
                ) : (
                  <div className="px-4 py-2">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-3 text-center">
                      Delete this resume?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Yes
                      </button>
                      <button
                        onClick={() => setIsConfirmingDelete(false)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <X className="w-3 h-3" /> No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
