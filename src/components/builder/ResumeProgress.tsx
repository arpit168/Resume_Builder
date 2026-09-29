"use client";

import { ResumeData } from "@/types/resume";
import { useMemo } from "react";

export function ResumeProgress({ data }: { data: ResumeData }) {
  const progress = useMemo(() => {
    let score = 0;

    // Personal Info (Max 20%)
    if (data.personalInfo.fullName) score += 5;
    if (data.personalInfo.email) score += 5;
    if (data.personalInfo.phone) score += 5;
    if (data.personalInfo.jobTitle) score += 5;

    // Summary (Max 15%)
    if (data.summary && data.summary.trim().length > 10) score += 15;

    // Experience (Max 25%)
    if (data.experience.length > 0) {
      score += 15;
      if (
        data.experience[0].description &&
        data.experience[0].description.length > 20
      ) {
        score += 10;
      }
    }

    // Education (Max 15%)
    if (data.education.length > 0) score += 15;

    // Skills (Max 15%)
    if (data.skills.length > 0) {
      score += Math.min(15, data.skills.length * 3); // 5 skills for max points
    }

    // Extras (Max 10%)
    if (
      data.projects.length > 0 ||
      data.certifications.length > 0 ||
      data.languages.length > 0
    ) {
      score += 10;
    }

    return Math.min(100, score);
  }, [data]);

  // Determine color based on progress
  let colorClass = "bg-gradient-to-r from-red-500 to-orange-500";
  if (progress > 40)
    colorClass = "bg-gradient-to-r from-orange-500 to-amber-500";
  if (progress > 70)
    colorClass = "bg-gradient-to-r from-blue-500 to-indigo-500";
  if (progress === 100)
    colorClass = "bg-gradient-to-r from-emerald-500 to-teal-500";

  return (
    <div className="w-full bg-white dark:bg-neutral-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-800 p-5 shrink-0 z-10 sticky top-0 shadow-sm">
      <div className="flex justify-between items-end mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Profile Strength
        </span>
        <span
          className={`text-sm font-bold ${progress === 100 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}
        >
          {progress}%
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full ${colorClass} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-2.5 flex items-center gap-1.5">
        {progress < 40 && "Fill out more basic information to get started."}
        {progress >= 40 &&
          progress < 70 &&
          "Looking good! Add some experience and skills."}
        {progress >= 70 &&
          progress < 100 &&
          "Almost there! Add a summary or some extra sections."}
        {progress === 100 && "Great job! Your resume is looking strong."}
      </p>
    </div>
  );
}
