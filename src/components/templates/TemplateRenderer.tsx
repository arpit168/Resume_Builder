// Force reload
"use client";

import { Resume } from "@/types/resume";
import { ModernTemplate } from "./ModernTemplate";
import { ProfessionalTemplate } from "./ProfessionalTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { ExecutiveTemplate } from "./ExecutiveTemplate";
import { CreativeTemplate } from "./CreativeTemplate";
import { ElegantTemplate } from "./ElegantTemplate";
import { CorporateTemplate } from "./CorporateTemplate";
import { StandardTemplate } from "./StandardTemplate";
import { OrganicTemplate } from "./OrganicTemplate";
import { StructuredTemplate } from "./StructuredTemplate";

export function TemplateRenderer({ resume }: { resume: Resume }) {
  switch (resume.template) {
    case "modern":
      return <ModernTemplate data={resume.data} theme={resume.colorTheme} />;
    case "professional":
      return <ProfessionalTemplate data={resume.data} theme={resume.colorTheme} />;
    case "minimal":
      return <MinimalTemplate data={resume.data} theme={resume.colorTheme} />;
    case "executive":
      return <ExecutiveTemplate data={resume.data} theme={resume.colorTheme} />;
    case "creative":
      return <CreativeTemplate data={resume.data} theme={resume.colorTheme} />;
    case "elegant":
      return <ElegantTemplate data={resume.data} theme={resume.colorTheme} />;
    case "corporate":
      return <CorporateTemplate data={resume.data} theme={resume.colorTheme} />;
    case "standard":
      return <StandardTemplate data={resume.data} theme={resume.colorTheme} />;
    case "organic":
      return <OrganicTemplate data={resume.data} theme={resume.colorTheme} />;
    case "structured":
      return <StructuredTemplate data={resume.data} theme={resume.colorTheme} />;
    default:
      return <ModernTemplate data={resume.data} theme={resume.colorTheme} />;
  }
}
