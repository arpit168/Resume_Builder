"use client";

import { ResumeTemplate } from "@/types/resume";
import { useResume } from "@/hooks/useResume";

const templates: { id: ResumeTemplate; label: string }[] = [
  { id: "modern", label: "Modern" },
  { id: "professional", label: "Professional" },
  { id: "minimal", label: "Minimal" },
  { id: "executive", label: "Executive" },
];

export function TemplateSelector({ currentTemplate, resumeId }: { currentTemplate: ResumeTemplate, resumeId: string }) {
  const { setTemplate } = useResume();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 font-medium hidden md:inline">Template:</span>
      <select
        value={currentTemplate}
        onChange={(e) => setTemplate(resumeId, e.target.value as ResumeTemplate)}
        className="text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {templates.map((t) => (
          <option key={t.id} value={t.id}>{t.label}</option>
        ))}
      </select>
    </div>
  );
}
