"use client";

import { useResume } from "@/hooks/useResume";
import { Resume } from "@/types/resume";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export function SkillForm({ resume }: { resume: Resume }) {
  const { addSkill, updateSkill, deleteSkill, updateResume } = useResume();
  const skills = resume.data.skills;

  const handleAdd = () => {
    addSkill(resume.id, {
      id: crypto.randomUUID(),
      name: "",
      level: "Intermediate",
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...skills];
    [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
    updateResume(resume.id, { data: { ...resume.data, skills: newArr } });
  };

  const moveDown = (index: number) => {
    if (index === skills.length - 1) return;
    const newArr = [...skills];
    [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
    updateResume(resume.id, { data: { ...resume.data, skills: newArr } });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2 border-gray-200 dark:border-gray-800 mb-4">
        <h2 className="text-xl font-bold">Skills</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg transition-colors font-medium"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <p>No skills added yet.</p>
          <button
            onClick={handleAdd}
            className="mt-2 text-blue-600 dark:text-blue-500 hover:underline text-sm font-medium"
          >
            + Add your first skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <div
              key={skill.id}
              className="flex flex-col gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm group"
            >
              <div className="flex items-center gap-2">
                <div className="flex flex-col -ml-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === skills.length - 1}
                    className="text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) =>
                    updateSkill(resume.id, skill.id, { name: e.target.value })
                  }
                  placeholder="e.g. JavaScript"
                  className="flex-1 min-w-0 border-none bg-transparent font-medium focus:ring-0 p-0 text-sm dark:text-gray-100"
                />

                <button
                  onClick={() => deleteSkill(resume.id, skill.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="pl-6">
                <select
                  value={skill.level}
                  onChange={(e) =>
                    updateSkill(resume.id, skill.id, { level: e.target.value })
                  }
                  className="w-full text-xs border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-600 dark:text-gray-300"
                >
                  <option value="">Don&apos;t show level</option>
                  {SKILL_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
