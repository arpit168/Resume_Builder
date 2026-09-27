import { useState, useEffect } from "react";
import { useResumeStore, ResumeState } from "@/store/resumeStore";

// Safe SSR hook for Zustand persist.
// Returns empty/noop state until client-side hydration completes,
// preventing hydration mismatches between server and client.
export function useResume(): ResumeState & { isHydrated: boolean } {
  const [isHydrated, setIsHydrated] = useState(false);

  // Subscribe to store slices individually to minimize re-renders
  const resumes = useResumeStore((s) => s.resumes);
  const createResume = useResumeStore((s) => s.createResume);
  const updateResume = useResumeStore((s) => s.updateResume);
  const deleteResume = useResumeStore((s) => s.deleteResume);
  const duplicateResume = useResumeStore((s) => s.duplicateResume);
  const clearResumeData = useResumeStore((s) => s.clearResumeData);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo);
  const updateSummary = useResumeStore((s) => s.updateSummary);
  const _addItem = useResumeStore((s) => s._addItem);
  const _updateItem = useResumeStore((s) => s._updateItem);
  const _deleteItem = useResumeStore((s) => s._deleteItem);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const deleteExperience = useResumeStore((s) => s.deleteExperience);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const deleteEducation = useResumeStore((s) => s.deleteEducation);
  const addSkill = useResumeStore((s) => s.addSkill);
  const updateSkill = useResumeStore((s) => s.updateSkill);
  const deleteSkill = useResumeStore((s) => s.deleteSkill);
  const addProject = useResumeStore((s) => s.addProject);
  const updateProject = useResumeStore((s) => s.updateProject);
  const deleteProject = useResumeStore((s) => s.deleteProject);
  const addCertification = useResumeStore((s) => s.addCertification);
  const updateCertification = useResumeStore((s) => s.updateCertification);
  const deleteCertification = useResumeStore((s) => s.deleteCertification);
  const addLanguage = useResumeStore((s) => s.addLanguage);
  const updateLanguage = useResumeStore((s) => s.updateLanguage);
  const deleteLanguage = useResumeStore((s) => s.deleteLanguage);
  const addAchievement = useResumeStore((s) => s.addAchievement);
  const updateAchievement = useResumeStore((s) => s.updateAchievement);
  const deleteAchievement = useResumeStore((s) => s.deleteAchievement);
  const addCustomSection = useResumeStore((s) => s.addCustomSection);
  const updateCustomSection = useResumeStore((s) => s.updateCustomSection);
  const deleteCustomSection = useResumeStore((s) => s.deleteCustomSection);
  const updateDesign = useResumeStore((s) => s.updateDesign);
  const resetDesign = useResumeStore((s) => s.resetDesign);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // Return empty safe state during SSR / before hydration
    const noop = () => {};
    return {
      isHydrated: false,
      resumes: [],
      createResume: () => {
        throw new Error("Not hydrated");
      },
      updateResume: noop,
      deleteResume: noop,
      duplicateResume: noop,
      clearResumeData: noop,
      setTemplate: noop,
      updatePersonalInfo: noop,
      updateSummary: noop,
      _addItem: noop,
      _updateItem: noop,
      _deleteItem: noop,
      addExperience: noop,
      updateExperience: noop,
      deleteExperience: noop,
      addEducation: noop,
      updateEducation: noop,
      deleteEducation: noop,
      addSkill: noop,
      updateSkill: noop,
      deleteSkill: noop,
      addProject: noop,
      updateProject: noop,
      deleteProject: noop,
      addCertification: noop,
      updateCertification: noop,
      deleteCertification: noop,
      addLanguage: noop,
      updateLanguage: noop,
      deleteLanguage: noop,
      addAchievement: noop,
      updateAchievement: noop,
      deleteAchievement: noop,
      addCustomSection: noop,
      updateCustomSection: noop,
      deleteCustomSection: noop,
      updateDesign: noop,
      resetDesign: noop,
    } as unknown as ResumeState & { isHydrated: boolean };
  }

  return {
    isHydrated: true,
    resumes,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume,
    clearResumeData,
    setTemplate,
    updatePersonalInfo,
    updateSummary,
    _addItem,
    _updateItem,
    _deleteItem,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    updateSkill,
    deleteSkill,
    addProject,
    updateProject,
    deleteProject,
    addCertification,
    updateCertification,
    deleteCertification,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    addCustomSection,
    updateCustomSection,
    deleteCustomSection,
    updateDesign,
    resetDesign,
  };
}
