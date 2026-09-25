"use client";

import { useResume } from "@/hooks/useResume";
import { Resume } from "@/types/resume";

export function SummaryForm({ resume }: { resume: Resume }) {
  const { updateSummary } = useResume();
  const summary = resume.data.summary;
  const maxLength = 600;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= maxLength) {
      updateSummary(resume.id, val);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-800 mb-4">
        <h2 className="text-xl font-bold">Professional Summary</h2>
        <span
          className={`text-xs font-medium ${summary.length >= maxLength ? "text-red-500" : "text-gray-500"}`}
        >
          {summary.length} / {maxLength}
        </span>
      </div>

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Write a short summary highlighting your most valuable skills,
          experiences, and accomplishments.
        </p>
        <textarea
          value={summary}
          onChange={handleChange}
          placeholder="e.g. Passionate and detail-oriented Frontend Developer with 5+ years of experience building responsive web applications..."
          className="w-full h-40 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />
      </div>
    </div>
  );
}
