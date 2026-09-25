"use client";

import { useParams } from "next/navigation";
import { ResumeBuilderView } from "@/components/builder/ResumeBuilderView";

export default function BuilderPage() {
  const params = useParams();
  const resumeId = params.resumeId as string;

  return <ResumeBuilderView resumeId={resumeId} />;
}
