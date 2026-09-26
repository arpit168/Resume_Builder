// Force reload
"use client";

import { Resume } from "@/types/resume";
import { ModernTemplate } from "./ModernTemplate";
import { ProfessionalTemplate } from "./ProfessionalTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { StandardTemplate } from "./StandardTemplate";
import { StructuredTemplate } from "./StructuredTemplate";

export function TemplateRenderer({ resume }: { resume: Resume }) {
  switch (resume.template) {
    case "modern":
      return <ModernTemplate data={resume.data} theme={resume.colorTheme} />;
    case "professional":
      return (
        <ProfessionalTemplate data={resume.data} theme={resume.colorTheme} />
      );
    case "minimal":
      return <MinimalTemplate data={resume.data} theme={resume.colorTheme} />;
    case "standard":
      return <StandardTemplate data={resume.data} theme={resume.colorTheme} />;
    case "structured":
      return (
        <StructuredTemplate data={resume.data} theme={resume.colorTheme} />
      );
    default:
      return <ModernTemplate data={resume.data} theme={resume.colorTheme} />;
  }
}
