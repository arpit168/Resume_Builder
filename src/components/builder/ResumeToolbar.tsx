"use client";

import { Resume, ResumeTemplate, ResumeTheme } from "@/types/resume";
import { useResume } from "@/hooks/useResume";
import { Printer, Download, Edit, Eye, Loader2, FileJson, Upload, RotateCcw } from "lucide-react";
import React, { useState, useRef } from "react";

const TEMPLATES: ResumeTemplate[] = ["modern", "professional", "minimal", "executive", "creative", "elegant", "corporate", "standard", "organic", "structured"];
const THEMES: { id: ResumeTheme; color: string; name: string }[] = [
  { id: "blue", color: "bg-blue-600", name: "Blue" },
  { id: "green", color: "bg-green-600", name: "Green" },
  { id: "purple", color: "bg-purple-600", name: "Purple" },
  { id: "red", color: "bg-red-600", name: "Red" },
  { id: "gray", color: "bg-gray-800", name: "Gray" },
];

export function ResumeToolbar({ 
  resume,
  mobileView,
  setMobileView
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

  const handleThemeChange = (theme: ResumeTheme) => {
    updateResume(resume.id, { colorTheme: theme });
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(resume, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.href = url;
    downloadAnchorNode.download = `${resume.name.replace(/\s+/g, '_')}_backup.json`;
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (importedData && importedData.data && importedData.data.personalInfo) {
          updateResume(resume.id, { 
            data: importedData.data,
            template: importedData.template || resume.template,
            colorTheme: importedData.colorTheme || resume.colorTheme
          });
          alert("Resume imported successfully!");
        } else {
          alert("Invalid resume format.");
        }
      } catch {
        alert("Failed to parse file.");
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      const { toJpeg } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');
      
      const element = document.getElementById('resume-preview-paper');
      if (!element) return;

      const originalTransform = element.style.transform;
      element.style.transform = 'scale(1)';
      
      await new Promise(resolve => setTimeout(resolve, 100));

      const imgData = await toJpeg(element, {
        quality: 0.98,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
      });

      element.style.transform = originalTransform;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resume.data.personalInfo.fullName?.replace(/\s+/g, '_') || 'Resume'}.pdf`);
      
    } catch (error) {
      console.error("Failed to generate PDF", error);
      alert("Failed to generate PDF. Please try Print -> Save as PDF instead.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0 print:hidden gap-4">
      {/* Mobile Toggle View */}
      {setMobileView && (
        <div className="flex w-full lg:hidden border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shrink-0">
          <button 
            onClick={() => setMobileView("edit")}
            className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium transition-colors ${mobileView === 'edit' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button 
            onClick={() => setMobileView("preview")}
            className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium transition-colors ${mobileView === 'preview' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>
      )}

      <div className="flex items-center gap-6 w-full sm:w-auto flex-wrap sm:pb-0">
        {/* Template Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">Template:</label>
          <select 
            value={resume.template}
            onChange={handleTemplateChange}
            className="text-sm border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1.5 bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 capitalize min-w-[120px]"
          >
            {TEMPLATES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>


      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-auto">
        <button 
          onClick={() => {
            if(confirm("Are you sure you want to clear all data and start fresh?")) {
              clearResumeData(resume.id);
            }
          }}
          title="Start Fresh (Clear Data)"
          className="flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors font-medium mr-1"
        >
          <RotateCcw className="w-4 h-4" /> <span className="hidden lg:inline">Start Fresh</span>
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

        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors font-medium"
        >
          <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Print</span>
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
          <span className="hidden sm:inline">{isGeneratingPDF ? "Generating..." : "PDF"}</span>
        </button>
      </div>
    </div>
  );
}
