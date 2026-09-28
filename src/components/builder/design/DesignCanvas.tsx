"use client";

import { Resume } from "@/types/resume";
import { TemplateRenderer } from "@/components/templates/TemplateRenderer";
import { useEffect, useRef, useState, useCallback } from "react";
import { getUniqueSelector } from "@/utils/design";
import { useResume } from "@/hooks/useResume";
import { ZoomIn, ZoomOut, Maximize, Keyboard } from "lucide-react";

export function DesignCanvas({
  resume,
  selectedSelector,
  onSelect,
  externalZoom,
  onZoomChange,
  onOpenShortcuts,
}: {
  resume: Resume;
  selectedSelector: string | null;
  onSelect: (selector: string | null) => void;
  externalZoom?: number | null;
  onZoomChange?: (zoom: number | null) => void;
  onOpenShortcuts?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = useState(1);
  const [paperHeight, setPaperHeight] = useState(1123);
  const { updateDesign } = useResume();
  const isDraggingRef = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Use external zoom if provided, otherwise auto-fit
  const scale =
    externalZoom !== null && externalZoom !== undefined
      ? externalZoom
      : autoScale;

  // Overlay state
  const [overlayRect, setOverlayRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // Auto-fit scale
  const fitToScreen = useCallback(() => {
    if (containerRef.current) {
      const availableWidth = containerRef.current.clientWidth - 128;
      const A4_WIDTH = 794;
      const newScale = Math.min(availableWidth / A4_WIDTH, 1.5);
      setAutoScale(newScale);
      // If using auto-fit mode, also notify parent
      if (
        onZoomChange &&
        (externalZoom === null || externalZoom === undefined)
      ) {
        // Just update internal, the parent holds null = auto-fit
      }
    }
  }, [externalZoom, onZoomChange]);

  useEffect(() => {
    fitToScreen();
    const observer = new ResizeObserver(fitToScreen);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [fitToScreen]);

  // Track paper height — only re-attach observer when paperRef changes, not on every resume update
  useEffect(() => {
    if (!paperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setPaperHeight(entry.contentRect.height);
      }
    });
    observer.observe(paperRef.current);
    return () => observer.disconnect();
  }, []); // intentionally empty — paperRef.current is stable after mount

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
    // Poll for robust updates after design changes / animations
    const interval = setInterval(updateRect, 100);
    return () => clearInterval(interval);
  }, [selectedSelector, scale, resume.design]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Prevent link navigation in the editor
    if ((e.target as HTMLElement).closest("a")) {
      e.preventDefault();
    }

    if (isDraggingRef.current) return;

    // Triple click selects the entire page (root wrapper)
    if (e.detail === 3) {
      onSelect("#resume-preview-paper > div:nth-child(1)");
      return;
    }

    // Double click deselects
    if (e.detail === 2) {
      onSelect(null);
      return;
    }

    const target = e.target as HTMLElement;

    // Don't allow selecting QR code elements
    if (target.closest('[data-element="qr-code"]')) {
      onSelect(null);
      return;
    }

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

  // Dragging logic — uses refs to avoid stale closures, cleans up properly
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!selectedSelector) return;

    e.preventDefault();
    isDraggingRef.current = true;
    setIsDraggingState(true);
    e.currentTarget.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startY = e.clientY;

    const initialDesign = resume.design?.elements?.[selectedSelector] || {};
    const initialTransformX = initialDesign.x || 0;
    const initialTransformY = initialDesign.y || 0;

    const el = document.querySelector(selectedSelector) as HTMLElement;
    if (!el || !paperRef.current) {
      isDraggingRef.current = false;
      setIsDraggingState(false);
      return;
    }

    if (el.closest('[data-element="qr-code"]')) {
      isDraggingRef.current = false;
      setIsDraggingState(false);
      return;
    }

    const paperRect = paperRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    // Boundaries in unscaled coordinates
    const minDx = -(elRect.left - paperRect.left) / scale;
    const maxDx = (paperRect.right - elRect.right) / scale;
    const minDy = -(elRect.top - paperRect.top) / scale;
    const maxDy = (paperRect.bottom - elRect.bottom) / scale;

    const currentScale = scale; // capture scale at drag start to avoid stale closures
    const currentSelectedSelector = selectedSelector; // capture to avoid stale ref
    const currentResumeId = resume.id;

    const onPointerMove = (moveEvent: PointerEvent) => {
      let dx = (moveEvent.clientX - startX) / currentScale;
      let dy = (moveEvent.clientY - startY) / currentScale;

      // Clamp to paper boundaries (skip if moving the entire page wrapper)
      if (
        currentSelectedSelector !== "#resume-preview-paper > div:nth-child(1)"
      ) {
        dx = Math.max(minDx, Math.min(maxDx, dx));
        dy = Math.max(minDy, Math.min(maxDy, dy));
      }

      const newX = initialTransformX + dx;
      const newY = initialTransformY + dy;

      import("../../../utils/design").then(
        ({ checkOverlap, getPaintedTransform }) => {
          const painted = getPaintedTransform(el);
          const totalDx = newX - painted.x;
          const totalDy = newY - painted.y;

          if (
            currentSelectedSelector !==
              "#resume-preview-paper > div:nth-child(1)" &&
            checkOverlap(
              el,
              totalDx,
              totalDy,
              "resume-preview-paper",
              currentScale,
            )
          ) {
            return;
          }

          updateDesign(currentResumeId, {
            elements: {
              [currentSelectedSelector]: {
                ...initialDesign,
                x: newX,
                y: newY,
              },
            },
          });
        },
      );
    };

    const cleanup = () => {
      isDraggingRef.current = false;
      // Small delay to prevent click from firing immediately after drag ends
      setTimeout(() => setIsDraggingState(false), 50);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", cleanup);
      window.removeEventListener("pointercancel", cleanup);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", cleanup);
    // Also handle pointer cancel (e.g. touch interrupted, alt+tab)
    window.addEventListener("pointercancel", cleanup);
  };

  const isQRSelected =
    selectedSelector && typeof document !== "undefined"
      ? Boolean(
          document
            .querySelector(selectedSelector)
            ?.closest('[data-element="qr-code"]'),
        )
      : false;

  return (
    <div className="flex-1 flex flex-col relative h-full">
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
                  cursor: isDraggingState
                    ? "grabbing"
                    : isQRSelected
                      ? "not-allowed"
                      : "grab",
                  zIndex: 50,
                  pointerEvents: "auto",
                  touchAction: "none",
                }}
                className="transition-all duration-75"
              >
                {/* Drag Handle Label */}
                <div className="absolute -top-6 -left-0.5 flex items-center bg-blue-600 text-white text-[10px] rounded-t-md rounded-br-md font-medium shadow-sm whitespace-nowrap overflow-hidden pointer-events-auto">
                  <span className="px-2 py-1 cursor-grab">
                    {isQRSelected ? "Locked (QR Code)" : "Selected Element"}
                  </span>
                  <button
                    onPointerDown={(e) => {
                      e.stopPropagation(); // prevent drag
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (typeof document !== "undefined") {
                        const el = document.querySelector(selectedSelector);
                        if (
                          el &&
                          el.parentElement &&
                          el.parentElement.id !== "resume-preview-paper" &&
                          !el.parentElement.closest('[data-element="qr-code"]')
                        ) {
                          import("../../../utils/design").then(
                            ({ getUniqueSelector }) => {
                              const parentSel = getUniqueSelector(
                                el.parentElement as HTMLElement,
                                "resume-preview-paper",
                              );
                              if (parentSel) {
                                onSelect(parentSel);
                              }
                            },
                          );
                        }
                      }
                    }}
                    className="px-2 py-1 bg-blue-700 hover:bg-blue-800 transition-colors border-l border-blue-500 cursor-pointer"
                    title="Select Parent Group (moves entire block together)"
                  >
                    Select Parent ⬆
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl p-1.5 z-20">
        {/* Keyboard Shortcuts — calls parent handler directly instead of dispatching fake KeyboardEvent */}
        <button
          onClick={() => onOpenShortcuts?.()}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Keyboard Shortcuts (?)"
          aria-label="Open keyboard shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
        <button
          onClick={() => {
            const newZoom = Math.max(0.25, scale - 0.1);
            onZoomChange?.(newZoom);
            if (!onZoomChange) setAutoScale(newZoom);
          }}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Zoom Out (Ctrl -)"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-12 text-center select-none">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => {
            const newZoom = Math.min(3, scale + 0.1);
            onZoomChange?.(newZoom);
            if (!onZoomChange) setAutoScale(newZoom);
          }}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Zoom In (Ctrl +)"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
        <button
          onClick={() => {
            onZoomChange?.(null); // null = restore auto-fit
            fitToScreen();
          }}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          title="Fit to Screen (Ctrl+0)"
          aria-label="Fit to screen"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
