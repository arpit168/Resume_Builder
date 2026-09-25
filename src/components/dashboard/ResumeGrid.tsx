"use client";

import { useState } from "react";
import { useResume } from "@/hooks/useResume";
import { ResumeCard } from "./ResumeCard";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function ResumeGrid() {
  const { resumes, createResume, isHydrated } = useResume();
  const [search, setSearch] = useState("");
  const router = useRouter();

  if (!isHydrated) {
    return <div className="animate-pulse flex space-x-4">Loading resumes...</div>;
  }

  const filteredResumes = resumes.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = () => {
    const newResume = createResume("Untitled Resume");
    router.push(`/builder/${newResume.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search resumes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Resume
        </button>
      </div>

      {filteredResumes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-2">No resumes found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {search ? "Try a different search term" : "Get started by creating your first resume."}
          </p>
          {!search && (
            <button
              onClick={handleCreate}
              className="text-blue-600 dark:text-blue-500 font-medium hover:underline"
            >
              + Create your first resume
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
