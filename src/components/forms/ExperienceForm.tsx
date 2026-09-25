"use client";

import { useState } from "react";
import { useResume } from "@/hooks/useResume";
import { Resume, Experience } from "@/types/resume";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export function ExperienceForm({ resume }: { resume: Resume }) {
  const { addExperience, updateExperience, deleteExperience, updateResume } = useResume();
  const experiences = resume.data.experience;
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id || null);

  const handleAdd = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    addExperience(resume.id, newExp);
    setExpandedId(newExp.id);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...experiences];
    [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
    updateResume(resume.id, { data: { ...resume.data, experience: newArr } });
  };

  const moveDown = (index: number) => {
    if (index === experiences.length - 1) return;
    const newArr = [...experiences];
    [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
    updateResume(resume.id, { data: { ...resume.data, experience: newArr } });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-800 mb-4">
        <h2 className="text-xl font-bold">Work Experience</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <p>No work experience added yet.</p>
          <button onClick={handleAdd} className="mt-2 text-blue-600 dark:text-blue-500 hover:underline text-sm font-medium">
            + Add your first experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => {
            const isExpanded = expandedId === exp.id;

            return (
              <div key={exp.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-all">
                {/* Header */}
                <div 
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors ${isExpanded ? 'border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80' : ''}`}
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => moveUp(index)} disabled={index === 0} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => moveDown(index)} disabled={index === experiences.length - 1} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {exp.jobTitle || "(Not specified)"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {exp.company ? `${exp.company}${exp.location ? ` • ${exp.location}` : ''}` : "(Company not specified)"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteExperience(resume.id, exp.id); }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {/* Form Body */}
                {isExpanded && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Job Title</label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => updateExperience(resume.id, exp.id, { jobTitle: e.target.value })}
                          placeholder="e.g. Software Engineer"
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(resume.id, exp.id, { company: e.target.value })}
                          placeholder="e.g. Google"
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(resume.id, exp.id, { location: e.target.value })}
                          placeholder="e.g. New York, NY"
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(resume.id, exp.id, { current: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor={`current-${exp.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                          I currently work here
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Start Date</label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(resume.id, exp.id, { startDate: e.target.value })}
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">End Date</label>
                        <input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(resume.id, exp.id, { endDate: e.target.value })}
                          disabled={exp.current}
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(resume.id, exp.id, { description: e.target.value })}
                          placeholder="Describe your responsibilities, achievements, and technologies used..."
                          className="w-full h-32 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
