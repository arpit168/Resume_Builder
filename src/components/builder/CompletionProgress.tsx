"use client";

import { ResumeData } from "@/types/resume";

export function CompletionProgress({ data }: { data: ResumeData }) {
  // Very basic calculation for now
  let score = 0;
  const total = 6;
  
  if (data.personalInfo.fullName) score++;
  if (data.personalInfo.email) score++;
  if (data.summary) score++;
  if (data.experience.length > 0) score++;
  if (data.education.length > 0) score++;
  if (data.skills.length > 0) score++;

  const percentage = Math.round((score / total) * 100);

  return (
    <div className="hidden lg:flex items-center gap-2 text-sm font-medium">
      <span className="text-gray-500">Progress</span>
      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-blue-600 dark:text-blue-400 w-8">{percentage}%</span>
    </div>
  );
}
