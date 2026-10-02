"use client";

import { Resume, ResumeTemplate } from "@/types/resume";
import { useResume } from "@/hooks/useResume";
import {
  Printer,
  Download,
  Edit,
  Eye,
  Loader2,
  FileJson,
  Upload,
  RotateCcw,
} from "lucide-react";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { generateResumePdf } from "@/lib/pdf/generatePdf";
import { useToastStore } from "@/store/toastStore";

const TEMPLATES: ResumeTemplate[] = [
  "modern",
  "professional",
  "minimal",
  "standard",
  "structured",
];

export function ResumeToolbar({
  resume,
  mobileView,
  setMobileView,
}: {
  resume: Resume;
  mobileView?: "edit" | "preview";
  setMobileView?: (view: "edit" | "preview") => void;
}) {
  const { updateResume, clearResumeData } = useResume();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateResume(resume.id, { template: e.target.value as ResumeTemplate });
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(resume, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.href = url;
    downloadAnchorNode.download = `${resume.name.replace(/\s+/g, "_")}_backup.json`;
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB — a resume JSON should never be this large)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      useToastStore
        .getState()
        .addToast(
          "File is too large. Please import a valid resume JSON file (max 5MB).",
          "error",
        );
      e.target.value = "";
      return;
    }

    // Validate file type
    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      useToastStore
        .getState()
        .addToast("Invalid file type. Please import a .json file.", "error");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (
          importedData &&
          importedData.data &&
          importedData.data.personalInfo
        ) {
          const safeData = {
            ...importedData.data,
            experience: Array.isArray(importedData.data.experience)
              ? importedData.data.experience
              : [],
            education: Array.isArray(importedData.data.education)
              ? importedData.data.education
              : [],
            skills: Array.isArray(importedData.data.skills)
              ? importedData.data.skills
              : [],
            projects: Array.isArray(importedData.data.projects)
              ? importedData.data.projects
              : [],
            certifications: Array.isArray(importedData.data.certifications)
              ? importedData.data.certifications
              : [],
            languages: Array.isArray(importedData.data.languages)
              ? importedData.data.languages
              : [],
            achievements: Array.isArray(importedData.data.achievements)
              ? importedData.data.achievements
              : [],
            customSections: Array.isArray(importedData.data.customSections)
              ? importedData.data.customSections
              : [],
          };
          updateResume(resume.id, {
            data: safeData,
            template: importedData.template || resume.template,
            colorTheme: importedData.colorTheme || resume.colorTheme,
          });
          useToastStore
            .getState()
            .addToast("Resume imported successfully!", "success");
        } else {
          useToastStore
            .getState()
            .addToast(
              "Invalid resume format. The file does not appear to be a valid HireCraft resume backup.",
              "error",
            );
        }
      } catch {
        useToastStore
          .getState()
          .addToast(
            "Failed to parse the file. Please ensure it is a valid JSON file.",
            "error",
          );
      }
      e.target.value = "";
    };
    reader.onerror = () => {
      useToastStore
        .getState()
        .addToast("Unable to read the file. Please try again.", "error");
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);

      const element = document.getElementById("resume-preview-paper");
      if (!element) return;

      const filename = `${resume.data.personalInfo.fullName?.replace(/\s+/g, "_") || "Resume"}.pdf`;
      await generateResumePdf(element, filename, resume.data);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      useToastStore
        .getState()
        .addToast(
          "Failed to generate PDF. Please try Print -> Save as PDF instead.",
          "error",
        );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 shrink-0 print:hidden gap-4 sticky top-0 z-30">
      {/* Mobile Toggle View */}
      {setMobileView && (
        <div className="flex w-full lg:hidden border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden shrink-0 shadow-sm p-1 bg-gray-50/50 dark:bg-neutral-900/50">
          <button
            onClick={() => setMobileView("edit")}
            className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${mobileView === "edit" ? "bg-white text-blue-600 shadow-sm dark:bg-neutral-800 dark:text-blue-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${mobileView === "preview" ? "bg-white text-blue-600 shadow-sm dark:bg-neutral-800 dark:text-blue-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>
      )}

      <div className="flex items-center gap-6 w-full sm:w-auto flex-wrap sm:pb-0">
        {/* Template Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 hidden md:block uppercase tracking-wider">
            Template
          </label>
          <select
            value={resume.template}
            onChange={handleTemplateChange}
            className="text-sm font-medium border border-gray-300 dark:border-neutral-700 rounded-xl px-3 py-2 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 capitalize min-w-[130px] shadow-sm transition-all"
          >
            {TEMPLATES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 self-end sm:self-auto">
        <button
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to clear all data and start fresh?",
              )
            ) {
              clearResumeData(resume.id);
            }
          }}
          title="Start Fresh (Clear Data)"
          className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors font-semibold mr-1"
        >
          <RotateCcw className="w-4 h-4" />{" "}
          <span className="hidden lg:inline">Start Fresh</span>
        </button>
        <div className="w-px h-6 bg-gray-200 dark:bg-neutral-800 mx-1 hidden sm:block"></div>

        <div className="flex items-center bg-gray-50/50 dark:bg-neutral-900/50 p-1 rounded-xl border border-gray-200/50 dark:border-neutral-800/50">
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleImportJSON}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import JSON Backup"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white hover:shadow-sm dark:hover:bg-neutral-800 dark:hover:text-blue-400 transition-all rounded-lg"
          >
            <Upload className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={handleExportJSON}
            title="Export JSON Backup"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white hover:shadow-sm dark:hover:bg-neutral-800 dark:hover:text-blue-400 transition-all rounded-lg"
          >
            <FileJson className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-neutral-800 mx-1 hidden sm:block"></div>

        <Link
          href={`/builder/${resume.id}/design`}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors font-semibold shadow-sm"
        >
          <Edit className="w-4 h-4" />{" "}
          <span className="hidden sm:inline">Design Mode</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors font-semibold shadow-sm"
        >
          <Printer className="w-4 h-4" />{" "}
          <span className="hidden sm:inline">Print</span>
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="flex items-center gap-2 text-sm px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-semibold shadow-sm hover:shadow-md transform hover:scale-[1.02]"
        >
          {isGeneratingPDF ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isGeneratingPDF ? "Generating..." : "Download PDF"}
          </span>
        </button>
      </div>
    </div>
  );
}
