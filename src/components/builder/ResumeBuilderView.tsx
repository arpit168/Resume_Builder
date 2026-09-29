"use client";

import { useResume } from "@/hooks/useResume";
import { ResumeEditor } from "./ResumeEditor";
import { ResumePreview } from "./ResumePreview";
import { ResumeToolbar } from "./ResumeToolbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useToastStore } from "@/store/toastStore";

export function ResumeBuilderView({ resumeId }: { resumeId: string }) {
  const { resumes, isHydrated } = useResume();
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const router = useRouter();

  useEffect(() => {
    if (isHydrated) {
      const found = resumes.find((r) => r.id === resumeId);
      if (!found) {
        useToastStore.getState().addToast("Resume not found", "error");
        router.push("/");
      }
    }
  }, [isHydrated, resumes, resumeId, router]);

  if (!isHydrated)
    return <div className="p-8 text-center">Loading builder...</div>;

  const resume = resumes.find((r) => r.id === resumeId);
  if (!resume) {
    return null;
  }

  return (
    <div
      id="resume-builder-layout"
      className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 dark:bg-black overflow-hidden print:h-auto print:overflow-visible"
    >
      <ResumeToolbar
        resume={resume}
        mobileView={mobileView}
        setMobileView={setMobileView}
      />

      <div className="flex flex-1 overflow-hidden print:overflow-visible print:block">
        {/* Editor Side */}
        <div
          className={`w-full lg:w-1/2 flex-col bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 print:hidden ${mobileView === "edit" ? "flex" : "hidden lg:flex"}`}
        >
          <ResumeEditor resume={resume} />
        </div>

        {/* Preview Side */}
        <div
          className={`w-full lg:w-1/2 flex-col bg-gray-100 dark:bg-neutral-900/50 relative print:!block print:!w-full ${mobileView === "preview" ? "flex" : "hidden lg:flex"}`}
        >
          <ResumePreview resume={resume} />
        </div>
      </div>
    </div>
  );
}
