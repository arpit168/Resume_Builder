"use client";

import { Resume } from "@/types/resume";
import { PersonalInfoForm } from "@/components/forms/PersonalInfoForm";
import { SummaryForm } from "@/components/forms/SummaryForm";
import { ExperienceForm } from "@/components/forms/ExperienceForm";
import { EducationForm } from "@/components/forms/EducationForm";
import { SkillForm } from "@/components/forms/SkillForm";
import { ProjectForm } from "@/components/forms/ProjectForm";
import { CertificationForm } from "@/components/forms/CertificationForm";
import { LanguageForm } from "@/components/forms/LanguageForm";
import { AchievementForm } from "@/components/forms/AchievementForm";
import { CustomSectionForm } from "@/components/forms/CustomSectionForm";
import { ResumeProgress } from "./ResumeProgress";

export function ResumeEditor({ resume }: { resume: Resume }) {
  return (
    <div className="h-full flex flex-col">
      <ResumeProgress data={resume.data} />
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-10">
        <PersonalInfoForm resume={resume} />
      <SummaryForm resume={resume} />
      <ExperienceForm resume={resume} />
      <EducationForm resume={resume} />
      <SkillForm resume={resume} />
      <ProjectForm resume={resume} />
      <CertificationForm resume={resume} />
      <LanguageForm resume={resume} />
      <AchievementForm resume={resume} />
      <CustomSectionForm resume={resume} />
      </div>
    </div>
  );
}
