"use client";

import { useState } from "react";
import { useResume } from "@/hooks/useResume";
import { Resume } from "@/types/resume";
import {
  FileText,
  Copy,
  Edit2,
  Trash2,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ResumeCard({ resume }: { resume: Resume }) {
  const { deleteResume, duplicateResume, updateResume } = useResume();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(resume.name);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this resume?")) {
      deleteResume(resume.id);
    }
  };

  const handleDuplicate = () => {
    duplicateResume(resume.id, `${resume.name} (Copy)`);
    setShowMenu(false);
  };

  const handleRename = () => {
    if (name.trim() && name !== resume.name) {
      updateResume(resume.id, { name: name.trim() });
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
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-[280px]">
      <div
        className="p-6 flex-grow cursor-pointer"
        onClick={() => router.push(`/builder/${resume.id}`)}
      >
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-lg flex items-center justify-center mb-4">
          <FileText className="w-6 h-6" />
        </div>

        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            onClick={(e) => e.stopPropagation()}
            className="w-full text-lg font-semibold bg-gray-50 dark:bg-gray-900 border border-blue-500 rounded px-2 py-1 mb-1 focus:outline-none"
            autoFocus
          />
        ) : (
          <h3 className="text-lg font-semibold mb-1 line-clamp-1">
            {resume.name}
          </h3>
        )}

        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
          Template: {resume.template}
        </p>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Updated {formatDate(resume.updatedAt)}
        </div>

        <div className="flex items-center gap-1">
          <Link
            href={`/builder/${resume.id}`}
            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
            title="Open"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div
                  className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" /> Rename
                  </button>
                  <button
                    onClick={handleDuplicate}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" /> Duplicate
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
