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
import { getSafeFontCss } from "@/lib/pdf/inlineStyles";

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
      alert(
        "File is too large. Please import a valid resume JSON file (max 5MB).",
      );
      e.target.value = "";
      return;
    }

    // Validate file type
    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      alert("Invalid file type. Please import a .json file.");
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
          alert("Resume imported successfully!");
        } else {
          alert(
            "Invalid resume format. The file does not appear to be a valid HireCraft resume backup.",
          );
        }
      } catch {
        alert(
          "Failed to parse the file. Please ensure it is a valid JSON file.",
        );
      }
      e.target.value = "";
    };
    reader.onerror = () => {
      alert("Unable to read the file. Please try again.");
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);

      const { toCanvas } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const element = document.getElementById("resume-preview-paper");
      if (!element) return;

      const originalTransform = element.style.transform;
      element.style.transform = "scale(1)";

      await new Promise((resolve) => setTimeout(resolve, 100));

      const safeFontCss = getSafeFontCss();

      const sourceCanvas = await toCanvas(element, {
        quality: 0.98,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
        fontEmbedCSS: safeFontCss,
      });

      element.style.transform = originalTransform;

      const a4WidthMm = 210;
      const a4HeightMm = 297;
      const pxPerMm = sourceCanvas.width / a4WidthMm;

      const bottomMarginMm = 10;
      const topMarginMm = 10; // For page 2+

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const ctx = sourceCanvas.getContext("2d");
      let yOffset = 0;
      let pageNum = 1;
      const sliceHeights: number[] = [];

      const findSafeSliceY = (startY: number, targetY: number) => {
        if (!ctx) return targetY;
        const scanLimit = Math.max(startY, targetY - 800);
        const heightToScan = targetY - scanLimit;
        if (heightToScan <= 0) return targetY;

        const imgData = ctx.getImageData(
          0,
          scanLimit,
          sourceCanvas.width,
          heightToScan,
        );
        const data = imgData.data;
        const rowBytes = sourceCanvas.width * 4;

        const rowsAreIdentical = (r1: number, r2: number) => {
          const o1 = r1 * rowBytes;
          const o2 = r2 * rowBytes;
          for (let i = 0; i < rowBytes; i++) {
            if (data[o1 + i] !== data[o2 + i]) return false;
          }
          return true;
        };

        let identicalCount = 0;
        for (let y = heightToScan - 1; y > 0; y--) {
          if (rowsAreIdentical(y, y - 1)) {
            identicalCount++;
            if (identicalCount >= 15) {
              return scanLimit + y + 7; // Return middle of gap
            }
          } else {
            identicalCount = 0;
          }
        }
        return targetY;
      };

      while (yOffset < sourceCanvas.height) {
        if (pageNum > 1) pdf.addPage();

        const currentTopMarginMm = pageNum > 1 ? topMarginMm : 0;
        const availableHeightMm =
          a4HeightMm - currentTopMarginMm - bottomMarginMm;
        const maxSlicePx = availableHeightMm * pxPerMm;

        let sliceHeight = Math.min(maxSlicePx, sourceCanvas.height - yOffset);

        if (yOffset + sliceHeight < sourceCanvas.height) {
          const safeY = findSafeSliceY(yOffset, yOffset + sliceHeight);
          sliceHeight = safeY - yOffset;
        }

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = sourceCanvas.width;
        sliceCanvas.height = sliceHeight;
        const sCtx = sliceCanvas.getContext("2d");

        if (sCtx) {
          sCtx.fillStyle = "#ffffff";
          sCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          sCtx.drawImage(
            sourceCanvas,
            0,
            yOffset,
            sourceCanvas.width,
            sliceHeight,
            0,
            0,
            sliceCanvas.width,
            sliceHeight,
          );
        }

        const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.98);
        const printHeightMm = sliceHeight / pxPerMm;

        pdf.addImage(
          sliceData,
          "JPEG",
          0,
          currentTopMarginMm,
          a4WidthMm,
          printHeightMm,
        );

        sliceHeights.push(sliceHeight);
        yOffset += sliceHeight;
        pageNum++;
      }

      // Add clickable links programmatically
      const links = element.querySelectorAll("a");
      const elementRect = element.getBoundingClientRect();
      const pxRatio = sourceCanvas.width / elementRect.width;

      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        const rect = link.getBoundingClientRect();

        const relX = rect.left - elementRect.left;
        const relY = rect.top - elementRect.top;
        const relW = rect.width;
        const relH = rect.height;

        const canvasX = relX * pxRatio;
        const canvasY = relY * pxRatio;
        const canvasW = relW * pxRatio;
        const canvasH = relH * pxRatio;

        let pNum = 1;
        let currentSliceY = 0;
        let pageSliceHeight = sliceHeights[0];

        while (
          pNum <= sliceHeights.length &&
          canvasY >= currentSliceY + pageSliceHeight
        ) {
          currentSliceY += pageSliceHeight;
          pNum++;
          pageSliceHeight = sliceHeights[pNum - 1];
        }

        if (pNum <= sliceHeights.length) {
          const yOnPageCanvas = canvasY - currentSliceY;

          const pageTopMarginMm = pNum > 1 ? topMarginMm : 0;

          const mmX = canvasX / pxPerMm;
          const mmY = yOnPageCanvas / pxPerMm + pageTopMarginMm;
          const mmW = canvasW / pxPerMm;
          const mmH = canvasH / pxPerMm;

          pdf.setPage(pNum);
          pdf.link(mmX, mmY, mmW, mmH, { url: href });
        }
      });

      pdf.save(
        `${resume.data.personalInfo.fullName?.replace(/\s+/g, "_") || "Resume"}.pdf`,
      );
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("Failed to generate PDF. Please try Print -> Save as PDF instead.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shrink-0 print:hidden gap-4">
      {/* Mobile Toggle View */}
      {setMobileView && (
        <div className="flex w-full lg:hidden border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shrink-0">
          <button
            onClick={() => setMobileView("edit")}
            className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium transition-colors ${mobileView === "edit" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30" : "bg-white text-gray-600 dark:bg-neutral-900 dark:text-gray-300"}`}
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium transition-colors ${mobileView === "preview" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30" : "bg-white text-gray-600 dark:bg-neutral-900 dark:text-gray-300"}`}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>
      )}

      <div className="flex items-center gap-6 w-full sm:w-auto flex-wrap sm:pb-0">
        {/* Template Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
            Template:
          </label>
          <select
            value={resume.template}
            onChange={handleTemplateChange}
            className="text-sm border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1.5 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-blue-500 capitalize min-w-[120px]"
          >
            {TEMPLATES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-auto">
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
          className="flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors font-medium mr-1"
        >
          <RotateCcw className="w-4 h-4" />{" "}
          <span className="hidden lg:inline">Start Fresh</span>
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>
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
          className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Upload className="w-5 h-5" />
        </button>
        <button
          onClick={handleExportJSON}
          title="Export JSON Backup"
          className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <FileJson className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>

        <Link
          href={`/builder/${resume.id}/design`}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors font-medium mr-1"
        >
          <Edit className="w-4 h-4" />{" "}
          <span className="hidden sm:inline">Design Mode</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors font-medium"
        >
          <Printer className="w-4 h-4" />{" "}
          <span className="hidden sm:inline">Print</span>
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
        >
          {isGeneratingPDF ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isGeneratingPDF ? "Generating..." : "PDF"}
          </span>
        </button>
      </div>
    </div>
  );
}
