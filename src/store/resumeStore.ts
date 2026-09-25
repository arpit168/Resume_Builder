import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Resume,
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Project,
  Certification,
  Language,
  Achievement,
  CustomSection,
  ResumeTemplate,
} from "../types/resume";

const initialPersonalInfo: PersonalInfo = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  linkedin: "",
  github: "",
  photoUrl: "",
};

const createEmptyResume = (id: string, name: string): Resume => ({
  id,
  name,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  template: "modern",
  colorTheme: "blue",
  data: {
    personalInfo: initialPersonalInfo,
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    achievements: [],
    customSections: [],
  },
});

export interface ResumeState {
  resumes: Resume[];

  // Resume Management
  createResume: (name: string) => Resume;
  updateResume: (id: string, data: Partial<Resume>) => void;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string, newName: string) => void;
  
  // Basic Info
  setTemplate: (resumeId: string, template: ResumeTemplate) => void;
  updatePersonalInfo: (resumeId: string, info: Partial<PersonalInfo>) => void;
  updateSummary: (resumeId: string, summary: string) => void;

  // Generic helper for array updates
  _addItem: <K extends keyof Omit<Resume["data"], "personalInfo" | "summary">>(resumeId: string, key: K, item: Resume["data"][K][number]) => void;
  _updateItem: <K extends keyof Omit<Resume["data"], "personalInfo" | "summary">>(resumeId: string, key: K, itemId: string, item: Partial<Resume["data"][K][number]>) => void;
  _deleteItem: <K extends keyof Omit<Resume["data"], "personalInfo" | "summary">>(resumeId: string, key: K, itemId: string) => void;

  // Specific Actions
  addExperience: (resumeId: string, exp: Experience) => void;
  updateExperience: (resumeId: string, expId: string, exp: Partial<Experience>) => void;
  deleteExperience: (resumeId: string, expId: string) => void;

  addEducation: (resumeId: string, edu: Education) => void;
  updateEducation: (resumeId: string, eduId: string, edu: Partial<Education>) => void;
  deleteEducation: (resumeId: string, eduId: string) => void;

  addSkill: (resumeId: string, skill: Skill) => void;
  updateSkill: (resumeId: string, skillId: string, skill: Partial<Skill>) => void;
  deleteSkill: (resumeId: string, skillId: string) => void;

  addProject: (resumeId: string, project: Project) => void;
  updateProject: (resumeId: string, projectId: string, project: Partial<Project>) => void;
  deleteProject: (resumeId: string, projectId: string) => void;

  addCertification: (resumeId: string, cert: Certification) => void;
  updateCertification: (resumeId: string, certId: string, cert: Partial<Certification>) => void;
  deleteCertification: (resumeId: string, certId: string) => void;

  addLanguage: (resumeId: string, lang: Language) => void;
  updateLanguage: (resumeId: string, langId: string, lang: Partial<Language>) => void;
  deleteLanguage: (resumeId: string, langId: string) => void;

  addAchievement: (resumeId: string, ach: Achievement) => void;
  updateAchievement: (resumeId: string, achId: string, ach: Partial<Achievement>) => void;
  deleteAchievement: (resumeId: string, achId: string) => void;

  addCustomSection: (resumeId: string, section: CustomSection) => void;
  updateCustomSection: (resumeId: string, sectionId: string, section: Partial<CustomSection>) => void;
  deleteCustomSection: (resumeId: string, sectionId: string) => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => {
      const updateData = (resumeId: string, updater: (data: Resume["data"]) => Resume["data"]) => {
        set((state) => ({
          resumes: state.resumes.map((r) => {
            if (r.id !== resumeId) return r;
            return {
              ...r,
              updatedAt: new Date().toISOString(),
              data: updater(r.data),
            };
          }),
        }));
      };

      return {
        resumes: [],

        createResume: (name: string) => {
          const id = crypto.randomUUID();
          const newResume = createEmptyResume(id, name);
          set((state) => ({
            resumes: [...state.resumes, newResume],
          }));
          return newResume;
        },

        updateResume: (id: string, updates: Partial<Resume>) => {
          set((state) => ({
            resumes: state.resumes.map((r) =>
              r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
            ),
          }));
        },

        deleteResume: (id: string) => {
          set((state) => ({
            resumes: state.resumes.filter((r) => r.id !== id),
          }));
        },

        duplicateResume: (id: string, newName: string) => {
          const state = get();
          const existing = state.resumes.find((r) => r.id === id);
          if (!existing) return;

          const newResume: Resume = {
            ...existing,
            id: crypto.randomUUID(),
            name: newName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            resumes: [...state.resumes, newResume],
          }));
        },

        setTemplate: (resumeId, template) => {
          set((state) => ({
            resumes: state.resumes.map((r) =>
              r.id === resumeId ? { ...r, template, updatedAt: new Date().toISOString() } : r
            ),
          }));
        },

        updatePersonalInfo: (resumeId, info) => {
          updateData(resumeId, (data) => ({
            ...data,
            personalInfo: { ...data.personalInfo, ...info },
          }));
        },

        updateSummary: (resumeId, summary) => {
          updateData(resumeId, (data) => ({
            ...data,
            summary,
          }));
        },

        // Generic helpers
        _addItem: (resumeId, key, item) => {
          updateData(resumeId, (data) => ({
            ...data,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key]: [...(data[key] as any[]), item],
          }));
        },
        _updateItem: (resumeId, key, itemId, itemUpdate) => {
          updateData(resumeId, (data) => ({
            ...data,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key]: (data[key] as any[]).map((i) =>
              i.id === itemId ? { ...i, ...itemUpdate } : i
            ),
          }));
        },
        _deleteItem: (resumeId, key, itemId) => {
          updateData(resumeId, (data) => ({
            ...data,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [key]: (data[key] as any[]).filter((i) => i.id !== itemId),
          }));
        },

        // Specific Array Actions
        addExperience: (resumeId, exp) => get()._addItem(resumeId, "experience", exp),
        updateExperience: (resumeId, expId, exp) => get()._updateItem(resumeId, "experience", expId, exp),
        deleteExperience: (resumeId, expId) => get()._deleteItem(resumeId, "experience", expId),

        addEducation: (resumeId, edu) => get()._addItem(resumeId, "education", edu),
        updateEducation: (resumeId, eduId, edu) => get()._updateItem(resumeId, "education", eduId, edu),
        deleteEducation: (resumeId, eduId) => get()._deleteItem(resumeId, "education", eduId),

        addSkill: (resumeId, skill) => get()._addItem(resumeId, "skills", skill),
        updateSkill: (resumeId, skillId, skill) => get()._updateItem(resumeId, "skills", skillId, skill),
        deleteSkill: (resumeId, skillId) => get()._deleteItem(resumeId, "skills", skillId),

        addProject: (resumeId, project) => get()._addItem(resumeId, "projects", project),
        updateProject: (resumeId, projectId, project) => get()._updateItem(resumeId, "projects", projectId, project),
        deleteProject: (resumeId, projectId) => get()._deleteItem(resumeId, "projects", projectId),

        addCertification: (resumeId, cert) => get()._addItem(resumeId, "certifications", cert),
        updateCertification: (resumeId, certId, cert) => get()._updateItem(resumeId, "certifications", certId, cert),
        deleteCertification: (resumeId, certId) => get()._deleteItem(resumeId, "certifications", certId),

        addLanguage: (resumeId, lang) => get()._addItem(resumeId, "languages", lang),
        updateLanguage: (resumeId, langId, lang) => get()._updateItem(resumeId, "languages", langId, lang),
        deleteLanguage: (resumeId, langId) => get()._deleteItem(resumeId, "languages", langId),

        addAchievement: (resumeId, ach) => get()._addItem(resumeId, "achievements", ach),
        updateAchievement: (resumeId, achId, ach) => get()._updateItem(resumeId, "achievements", achId, ach),
        deleteAchievement: (resumeId, achId) => get()._deleteItem(resumeId, "achievements", achId),

        addCustomSection: (resumeId, section) => get()._addItem(resumeId, "customSections", section),
        updateCustomSection: (resumeId, sectionId, section) => get()._updateItem(resumeId, "customSections", sectionId, section),
        deleteCustomSection: (resumeId, sectionId) => get()._deleteItem(resumeId, "customSections", sectionId),
      };
    },
    {
      name: "resume-builder-data",
    }
  )
);
