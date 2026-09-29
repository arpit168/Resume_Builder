"use client";

import { useState } from "react";
import { useResume } from "@/hooks/useResume";
import { ResumeCard } from "./ResumeCard";
import { Plus, Search, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/store/toastStore";

export function ResumeGrid() {
  const { resumes, createResume, isHydrated } = useResume();
  const [search, setSearch] = useState("");
  const router = useRouter();

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="w-full max-w-md h-10 bg-gray-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
          <div className="w-40 h-10 bg-gray-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[280px] bg-gray-100 dark:bg-neutral-800/50 border border-gray-200 dark:border-neutral-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const filteredResumes = resumes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = () => {
    const newResume = createResume("Untitled Resume");
    useToastStore
      .getState()
      .addToast("New resume created successfully", "success");
    router.push(`/builder/${newResume.id}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative max-w-md w-full group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search your resumes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm group-focus-within:shadow-md"
          />
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Create Resume
        </button>
      </div>

      {filteredResumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white/50 dark:bg-neutral-900/20 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-neutral-800 border-dashed text-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {search ? "No matches found" : "Create your first resume"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
            {search
              ? `We couldn't find any resumes matching "${search}".`
              : "Start building your professional resume in minutes. It's completely free and requires no sign-up."}
          </p>
          {!search && (
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" /> Let&apos;s get started
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </div>
  );
}
