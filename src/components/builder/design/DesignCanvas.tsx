"use client";

import { Resume } from "@/types/resume";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { useEffect, useRef, useState } from "react";
import { getUniqueSelector } from "@/utils/design";
import { useResume } from "@/hooks/useResume";
import { ZoomIn, ZoomOut, Maximize, Keyboard } from "lucide-react";

export function DesignCanvas({
  resume,
  selectedSelector,
  onSelect,
}: {
  resume: Resume;
  selectedSelector: string | null;
  onSelect: (selector: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [paperHeight, setPaperHeight] = useState(1123);
  const { updateDesign } = useResume();
  const [isDragging, setIsDragging] = useState(false);

  // Overlay state
  const [overlayRect, setOverlayRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // Auto-fit scale
  const fitToScreen = () => {
    if (containerRef.current) {
      const availableWidth = containerRef.current.clientWidth - 128;
      const A4_WIDTH = 794;
      setScale(Math.min(availableWidth / A4_WIDTH, 1.5));
    }
  };

  useEffect(() => {
    fitToScreen();
    const observer = new ResizeObserver(fitToScreen);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!paperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setPaperHeight(entry.contentRect.height);
      }
    });
    observer.observe(paperRef.current);
    return () => observer.disconnect();
  }, [resume]);

  // Update overlay rect based on selected selector
  useEffect(() => {
    if (!selectedSelector || !paperRef.current) {
      setOverlayRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.querySelector(selectedSelector) as HTMLElement;
      if (el && paperRef.current) {
        const paperRect = paperRef.current.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        // Calculate relative to unscaled paper coordinates
        // The paper is scaled using transform: scale()
        setOverlayRect({
          top: (elRect.top - paperRect.top) / scale,
          left: (elRect.left - paperRect.left) / scale,
          width: elRect.width / scale,
          height: elRect.height / scale,
        });
      } else {
        setOverlayRect(null);
      }
    };

    updateRect();
    const interval = setInterval(updateRect, 100); // Polling for robust updates during animations
    return () => clearInterval(interval);
  }, [selectedSelector, scale, resume.design]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // If the user clicked a link (or something inside a link), prevent navigation
    if ((e.target as HTMLElement).closest("a")) {
      e.preventDefault();
    }

    if (isDragging) return;

    // Triple click selects the entire page (root wrapper)
    if (e.detail === 3) {
      onSelect("#resume-preview-paper");
      return;
    }

    // Double click releases (deselects) the element
    if (e.detail === 2) {
      onSelect(null);
      return;
    }

    // Find clicked element inside paper
    const target = e.target as HTMLElement;
    if (target.id === "resume-preview-paper" || target === paperRef.current) {
      onSelect(null);
      return;
    }

    const selector = getUniqueSelector(target, "resume-preview-paper");
    if (selector) {
      onSelect(selector);
    } else {
      onSelect(null);
    }
  };

  // Dragging logic
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!selectedSelector) return;

    // Prevent default to stop text selection and native dragging which can scroll the page
    e.preventDefault();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startY = e.clientY;

    const initialDesign = resume.design?.elements?.[selectedSelector] || {};
    const initialTransformX = initialDesign.x || 0;
    const initialTransformY = initialDesign.y || 0;

    const el = document.querySelector(selectedSelector) as HTMLElement;
    if (!el || !paperRef.current) {
      setIsDragging(false);
      return;
    }

    const paperRect = paperRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    // Calculate maximum allowable drag distances in unscaled coordinates
    const minDx = -(elRect.left - paperRect.left) / scale;
    const maxDx = (paperRect.right - elRect.right) / scale;
    const minDy = -(elRect.top - paperRect.top) / scale;
    const maxDy = (paperRect.bottom - elRect.bottom) / scale;

    const onPointerMove = (moveEvent: PointerEvent) => {
      let dx = (moveEvent.clientX - startX) / scale;
      let dy = (moveEvent.clientY - startY) / scale;

      // Clamp to ensure the element doesn't cross the paper boundaries
      dx = Math.max(minDx, Math.min(maxDx, dx));
      dy = Math.max(minDy, Math.min(maxDy, dy));

      updateDesign(resume.id, {
        elements: {
          [selectedSelector]: {
            ...initialDesign,
            x: initialTransformX + dx,
            y: initialTransformY + dy,
          },
        },
      });
    };

    const onPointerUp = () => {
      setTimeout(() => setIsDragging(false), 50); // delay to prevent click firing
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return (
    <div className="flex-1 flex flex-col relative h-full">
      {/* Zoom Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setScale((s) => Math.max(0.3, s - 0.1))}
          className="p-1 hover:text-blue-600 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-medium w-12 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale((s) => Math.min(2, s + 0.1))}
          className="p-1 hover:text-blue-600 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button
          onClick={fitToScreen}
          className="p-1 hover:text-blue-600 transition-colors"
          title="Fit to screen"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex justify-center pb-24 relative"
      >
        <div
          style={{
            width: `${794 * scale}px`,
            height: `${paperHeight * scale}px`,
            marginTop: "3rem",
            marginBottom: "3rem",
          }}
          className="relative shrink-0 transition-all duration-200 ease-out"
        >
          {/* Paper */}
          <div
            ref={paperRef}
            onClick={handleCanvasClick}
            style={{
              width: "794px",
              minHeight: "1123px",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            className="absolute top-0 left-0 bg-white shadow-2xl flex flex-col text-gray-900 cursor-crosshair overflow-hidden"
            id="resume-preview-paper"
          >
            {/* The resume template renders here */}
            {/* Because of DesignStyleInjector in the parent, overrides will be applied via CSS! */}
            <TemplateRenderer resume={resume} />

            {/* Selection Overlay */}
            {overlayRect && selectedSelector && (
              <div
                onPointerDown={handlePointerDown}
                style={{
                  position: "absolute",
                  top: overlayRect.top,
                  left: overlayRect.left,
                  width: overlayRect.width,
                  height: overlayRect.height,
                  border: "2px solid #3b82f6",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  cursor: isDragging ? "grabbing" : "grab",
                  zIndex: 50,
                  pointerEvents: "auto",
                  touchAction: "none", // Prevents page from scrolling on touch devices while dragging
                }}
                className="transition-all duration-75"
              >
                {/* Drag Handle Label */}
                <div className="absolute -top-6 -left-0.5 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-t-md rounded-br-md font-medium shadow-sm whitespace-nowrap">
                  Selected Element
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Floating Canvas Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl p-1.5 z-20">
        <button
          onClick={() =>
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }))
          }
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>
        <button
          onClick={() => setScale((s) => Math.max(0.25, s - 0.1))}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Zoom Out (Ctrl -)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-12 text-center select-none">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale((s) => Math.min(3, s + 0.1))}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Zoom In (Ctrl +)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>
        <button
          onClick={fitToScreen}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title="Fit to Screen"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
