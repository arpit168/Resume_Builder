export type ResumeTemplate = "modern" | "professional" | "minimal" | "executive";
export type ResumeTheme = "blue" | "green" | "purple" | "red" | "gray";

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photoUrl: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: string; // e.g., "Beginner", "Intermediate", "Advanced", "Expert"
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string; // comma separated or text
  projectUrl: string;
  githubUrl: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string; // e.g., "Native", "Fluent", "Intermediate", "Basic"
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  achievements: Achievement[];
  customSections: CustomSection[];
}

export interface Resume {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  template: ResumeTemplate;
  colorTheme: ResumeTheme;
  data: ResumeData;
}
