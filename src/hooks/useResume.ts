import { useState, useEffect } from "react";
import { useResumeStore, ResumeState } from "@/store/resumeStore";

// Safe SSR hook for Zustand persist
export function useResume(): ResumeState & { isHydrated: boolean } {
  const [isHydrated, setIsHydrated] = useState(false);
  const store = useResumeStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // Return empty state or placeholder during SSR
    return {
      isHydrated: false,
      resumes: [],
      createResume: () => {
        throw new Error("Not hydrated");
      },
      updateResume: () => {},
      deleteResume: () => {},
      duplicateResume: () => {},
      setTemplate: () => {},
      updatePersonalInfo: () => {},
      updateSummary: () => {},
      addExperience: () => {},
      updateExperience: () => {},
      deleteExperience: () => {},
      addEducation: () => {},
      updateEducation: () => {},
      deleteEducation: () => {},
      addSkill: () => {},
      updateSkill: () => {},
      deleteSkill: () => {},
      addProject: () => {},
      updateProject: () => {},
      deleteProject: () => {},
      addCertification: () => {},
      updateCertification: () => {},
      deleteCertification: () => {},
      addLanguage: () => {},
      updateLanguage: () => {},
      deleteLanguage: () => {},
      addAchievement: () => {},
      updateAchievement: () => {},
      deleteAchievement: () => {},
      addCustomSection: () => {},
      updateCustomSection: () => {},
      deleteCustomSection: () => {},
    } as unknown as ResumeState & { isHydrated: boolean };
  }

  return { ...store, isHydrated: true };
}
