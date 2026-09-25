"use client";

import { useState } from "react";
import { useResume } from "@/hooks/useResume";
import { Resume, Achievement } from "@/types/resume";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export function AchievementForm({ resume }: { resume: Resume }) {
  const { addAchievement, updateAchievement, deleteAchievement, updateResume } = useResume();
  const achievements = resume.data.achievements;
  const [expandedId, setExpandedId] = useState<string | null>(achievements[0]?.id || null);

  const handleAdd = () => {
    const newAchievement: Achievement = {
      id: crypto.randomUUID(),
      title: "",
      date: "",
      description: "",
    };
    addAchievement(resume.id, newAchievement);
    setExpandedId(newAchievement.id);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...achievements];
    [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
    updateResume(resume.id, { data: { ...resume.data, achievements: newArr } });
  };

  const moveDown = (index: number) => {
    if (index === achievements.length - 1) return;
    const newArr = [...achievements];
    [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
    updateResume(resume.id, { data: { ...resume.data, achievements: newArr } });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-800 mb-4">
        <h2 className="text-xl font-bold">Awards & Achievements</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" /> Add Achievement
        </button>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <p>No achievements added yet.</p>
          <button onClick={handleAdd} className="mt-2 text-blue-600 dark:text-blue-500 hover:underline text-sm font-medium">
            + Add your first achievement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {achievements.map((achievement, index) => {
            const isExpanded = expandedId === achievement.id;

            return (
              <div key={achievement.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-all">
                {/* Header */}
                <div 
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors ${isExpanded ? 'border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80' : ''}`}
                  onClick={() => setExpandedId(isExpanded ? null : achievement.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => moveUp(index)} disabled={index === 0} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => moveDown(index)} disabled={index === achievements.length - 1} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {achievement.title || "(Unnamed Achievement)"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {achievement.date || "(Date not specified)"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteAchievement(resume.id, achievement.id); }}
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
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Award / Achievement Title</label>
                        <input
                          type="text"
                          value={achievement.title}
                          onChange={(e) => updateAchievement(resume.id, achievement.id, { title: e.target.value })}
                          placeholder="e.g. Employee of the Year"
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date Received</label>
                        <input
                          type="month"
                          value={achievement.date}
                          onChange={(e) => updateAchievement(resume.id, achievement.id, { date: e.target.value })}
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                          value={achievement.description}
                          onChange={(e) => updateAchievement(resume.id, achievement.id, { description: e.target.value })}
                          placeholder="Briefly describe the significance of this achievement..."
                          className="w-full h-24 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
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
