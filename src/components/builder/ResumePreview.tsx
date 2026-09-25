"use client";

import { Resume } from "@/types/resume";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { useEffect, useRef, useState } from "react";

export function ResumePreview({ resume }: { resume: Resume }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [paperHeight, setPaperHeight] = useState(1123);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.clientWidth - 32;
        const A4_WIDTH = 794; 
        
        if (availableWidth > 0 && availableWidth < A4_WIDTH) {
          setScale(availableWidth / A4_WIDTH);
        } else if (availableWidth >= A4_WIDTH) {
          setScale(1);
        }
      }
    };

    const containerObserver = new ResizeObserver(() => {
      updateScale();
    });

    containerObserver.observe(containerRef.current);
    updateScale();

    return () => containerObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!paperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setPaperHeight(entry.contentRect.height);
      }
    });
    observer.observe(paperRef.current);
    return () => observer.disconnect();
  }, [resume]); // Re-attach if needed, though ref is stable

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-y-auto overflow-x-hidden flex justify-center bg-[#F8FAFC] dark:bg-[#0B0F19] print:bg-white print:p-0 print:block"
    >
      <div 
        style={{ 
          width: `${794 * scale}px`, 
          height: `${paperHeight * scale}px`,
          marginTop: "2rem",
          marginBottom: "2rem"
        }}
        className="relative shrink-0"
      >
        <div 
          ref={paperRef}
          style={{
            width: "794px",
            minHeight: "1123px",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          className="absolute top-0 left-0 bg-white shadow-xl flex flex-col print:shadow-none print:transform-none print:w-auto print:min-h-0 print:m-0" 
          id="resume-preview-paper"
        >
          <TemplateRenderer resume={resume} />
        </div>
      </div>
    </div>
  );
}
