"use client";

import { useResume } from "@/hooks/useResume";
import { useState, useEffect, useRef, useCallback } from "react";
import { DesignConfig } from "@/types/resume";
import { DesignToolbar } from "./DesignToolbar";
import { DesignCanvas } from "./DesignCanvas";
import { DesignSidebar } from "./DesignSidebar";
import { DesignStyleInjector } from "./DesignStyleInjector";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import { CommandPalette, CommandItem } from "./CommandPalette";
import { useToastStore } from "@/store/toastStore";

function isTypingContext(target: EventTarget | null): boolean {
  if (!target) return false;
  if (target instanceof HTMLInputElement) return true;
  if (target instanceof HTMLTextAreaElement) return true;
  if (target instanceof HTMLSelectElement) return true;
  if (target instanceof HTMLElement && target.isContentEditable) return true;
  return false;
}

function useDesignHistory(
  resumeId: string,
  currentDesign: DesignConfig | undefined,
  updateDesign: (id: string, design: Partial<DesignConfig>) => void,
  resetDesign: (id: string) => void,
) {
  const historyRef = useRef<DesignConfig[]>([]);
  const currentIndexRef = useRef<number>(-1);
  const isUndoRedoAction = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const syncState = useCallback(() => {
    setCanUndo(currentIndexRef.current > 0);
    setCanRedo(currentIndexRef.current < historyRef.current.length - 1);
  }, []);

  const undo = useCallback(() => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current -= 1;
      isUndoRedoAction.current = true;
      updateDesign(resumeId, historyRef.current[currentIndexRef.current]);
      setCanUndo(currentIndexRef.current > 0);
      setCanRedo(currentIndexRef.current < historyRef.current.length - 1);
    }
  }, [resumeId, updateDesign]);

  const redo = useCallback(() => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      currentIndexRef.current += 1;
      isUndoRedoAction.current = true;
      updateDesign(resumeId, historyRef.current[currentIndexRef.current]);
      setCanUndo(currentIndexRef.current > 0);
      setCanRedo(currentIndexRef.current < historyRef.current.length - 1);
    }
  }, [resumeId, updateDesign]);

  const reset = useCallback(() => {
    resetDesign(resumeId);
  }, [resumeId, resetDesign]);

  // Initialize history on first load
  useEffect(() => {
    if (historyRef.current.length === 0 && currentDesign) {
      historyRef.current = [JSON.parse(JSON.stringify(currentDesign))];
      currentIndexRef.current = 0;
      syncState();
    }
  }, [currentDesign, syncState]);

  // Debounced history snapshot — only records user-driven changes (not undo/redo)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    if (!currentDesign) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const currentSnapshot = JSON.parse(JSON.stringify(currentDesign));
      const lastSnapshot = historyRef.current[currentIndexRef.current];

      if (
        lastSnapshot &&
        JSON.stringify(currentSnapshot) !== JSON.stringify(lastSnapshot)
      ) {
        // Truncate any redo future when a new change is made
        historyRef.current = historyRef.current.slice(
          0,
          currentIndexRef.current + 1,
        );
        historyRef.current.push(currentSnapshot);
        // Cap history at 50 entries to prevent memory bloat
        if (historyRef.current.length > 50) {
          historyRef.current = historyRef.current.slice(
            historyRef.current.length - 50,
          );
        }
        currentIndexRef.current = historyRef.current.length - 1;
        setCanUndo(currentIndexRef.current > 0);
        setCanRedo(false); // After a new action, no future to redo
      }
    }, 500); // 500ms debounce ensures dragging only saves the final position
  }, [currentDesign]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { undo, redo, reset, canUndo, canRedo };
}

export function DesignEditorView({ resumeId }: { resumeId: string }) {
  const { resumes, isHydrated, updateDesign, resetDesign } = useResume();
  const [selectedSelector, setSelectedSelector] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number | null>(null); // null = auto-fit

  const resume = resumes.find((r) => r.id === resumeId);

  // Hook up Undo/Redo design history unconditionally (rules of hooks)
  const history = useDesignHistory(
    resumeId,
    resume?.design,
    updateDesign,
    resetDesign,
  );

  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Zoom handler exposed to DesignCanvas via ref/callback
  const handleZoomChange = useCallback((newZoom: number | null) => {
    setZoom(newZoom);
  }, []);

  useEffect(() => {
    if (!resume) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Never steal input from typing contexts
      if (isTypingContext(e.target)) return;

      const ctrl = e.ctrlKey || e.metaKey;

      // Undo: Ctrl+Z
      if (ctrl && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        history.undo();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (
        ctrl &&
        (e.key.toLowerCase() === "y" ||
          (e.shiftKey && e.key.toLowerCase() === "z"))
      ) {
        e.preventDefault();
        history.redo();
        return;
      }

      // Keyboard Shortcuts modal: ? or Ctrl+/
      if (e.key === "?" || (ctrl && e.key === "/")) {
        e.preventDefault();
        setShowShortcuts(true);
        return;
      }

      // Command Palette: Ctrl+K
      if (ctrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCommandPalette(true);
        return;
      }

      // Zoom: Ctrl++ / Ctrl+= (zoom in), Ctrl+- (zoom out), Ctrl+0 (reset)
      if (ctrl && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        setZoom((z) => Math.min(3, (z ?? 1) + 0.1));
        return;
      }
      if (ctrl && e.key === "-") {
        e.preventDefault();
        setZoom((z) => Math.max(0.25, (z ?? 1) - 0.1));
        return;
      }
      if (ctrl && e.key === "0") {
        e.preventDefault();
        setZoom(null); // null triggers auto-fit
        return;
      }

      // Text formatting shortcuts (only when element selected)
      if (ctrl && e.key.toLowerCase() === "b" && selectedSelector) {
        e.preventDefault();
        const currentW =
          resume.design?.elements?.[selectedSelector]?.fontWeight;
        updateDesign(resume.id, {
          elements: {
            [selectedSelector]: {
              fontWeight: currentW === "bold" ? "normal" : "bold",
            },
          },
        });
        return;
      }

      if (ctrl && e.key.toLowerCase() === "i" && selectedSelector) {
        e.preventDefault();
        const currentS = resume.design?.elements?.[selectedSelector]?.fontStyle;
        updateDesign(resume.id, {
          elements: {
            [selectedSelector]: {
              fontStyle: currentS === "italic" ? "normal" : "italic",
            },
          },
        });
        return;
      }

      if (ctrl && e.key.toLowerCase() === "u" && selectedSelector) {
        e.preventDefault();
        const currentDecor =
          resume.design?.elements?.[selectedSelector]?.textDecoration;
        updateDesign(resume.id, {
          elements: {
            [selectedSelector]: {
              textDecoration:
                currentDecor === "underline" ? "none" : "underline",
            },
          },
        });
        return;
      }

      // Arrow key fine-movement (only when element selected)
      if (
        (e.key === "ArrowUp" ||
          e.key === "ArrowDown" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight") &&
        selectedSelector
      ) {
        e.preventDefault(); // Prevent page scrolling

        if (typeof document !== "undefined") {
          const el = document.querySelector(selectedSelector);
          if (el && el.closest('[data-element="qr-code"]')) return;
        }

        let dx = 0;
        let dy = 0;
        const moveAmount = e.shiftKey ? 10 : 2; // Fine (2px) or large (10px) nudge

        if (e.key === "ArrowUp") dy -= moveAmount;
        if (e.key === "ArrowDown") dy += moveAmount;
        if (e.key === "ArrowLeft") dx -= moveAmount;
        if (e.key === "ArrowRight") dx += moveAmount;

        const currentX = resume.design?.elements?.[selectedSelector]?.x || 0;
        const currentY = resume.design?.elements?.[selectedSelector]?.y || 0;

        if (typeof document !== "undefined") {
          const el = document.querySelector(selectedSelector) as HTMLElement;
          const paper = document.getElementById("resume-preview-paper");
          if (el && paper) {
            import("../../../utils/design").then(
              ({ getPaintedTransform, getPaperScale }) => {
                const painted = getPaintedTransform(el);
                const scale = getPaperScale("resume-preview-paper");

                const newX = currentX + dx;
                const newY = currentY + dy;

                // Clamp within paper boundaries instead of using overlap detection,
                // which incorrectly blocks Left/Up movement due to dense resume content.
                const paperRect = paper.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();

                const minDx = -(elRect.left - paperRect.left) / scale;
                const maxDx = (paperRect.right - elRect.right) / scale;
                const minDy = -(elRect.top - paperRect.top) / scale;
                const maxDy = (paperRect.bottom - elRect.bottom) / scale;

                const totalDx = newX - painted.x;
                const totalDy = newY - painted.y;

                if (
                  selectedSelector !==
                    "#resume-preview-paper > div:nth-child(1)" &&
                  (totalDx < minDx ||
                    totalDx > maxDx ||
                    totalDy < minDy ||
                    totalDy > maxDy)
                ) {
                  return; // Would go out of paper bounds
                }

                updateDesign(resume.id, {
                  elements: {
                    [selectedSelector]: { x: newX, y: newY },
                  },
                });
              },
            );
            return;
          }
        }

        updateDesign(resume.id, {
          elements: {
            [selectedSelector]: {
              x: currentX + dx,
              y: currentY + dy,
            },
          },
        });
      }

      // Escape — deselect element
      if (e.key === "Escape" && selectedSelector) {
        e.preventDefault();
        setSelectedSelector(null);
      }

      // Shift + Enter — select parent
      if (e.key === "Enter" && e.shiftKey && selectedSelector) {
        e.preventDefault();
        if (typeof document !== "undefined") {
          const el = document.querySelector(selectedSelector);
          if (
            el &&
            el.parentElement &&
            el.parentElement.id !== "resume-preview-paper" &&
            !el.parentElement.closest('[data-element="qr-code"]')
          ) {
            import("../../../utils/design").then(({ getUniqueSelector }) => {
              const parentSel = getUniqueSelector(
                el.parentElement as HTMLElement,
                "resume-preview-paper",
              );
              if (parentSel) {
                setSelectedSelector(parentSel);
              }
            });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resume, selectedSelector, updateDesign, history]);

  const commands: CommandItem[] = [
    {
      id: "save",
      label: "Save Design",
      shortcut: "Ctrl+S",
      action: () => {
        // Design is auto-saved to localStorage via Zustand persist.
        // Provide user feedback.
        useToastStore
          .getState()
          .addToast(
            "Design saved automatically to your browser storage.",
            "success",
          );
      },
    },
    { id: "undo", label: "Undo", shortcut: "Ctrl+Z", action: history.undo },
    { id: "redo", label: "Redo", shortcut: "Ctrl+Y", action: history.redo },
    { id: "reset", label: "Reset All Design", action: history.reset },
    {
      id: "print",
      label: "Print / Export PDF",
      shortcut: "Ctrl+P",
      action: () => window.print(),
    },
    {
      id: "zoom-in",
      label: "Zoom In",
      shortcut: "Ctrl++",
      action: () => setZoom((z) => Math.min(3, (z ?? 1) + 0.1)),
    },
    {
      id: "zoom-out",
      label: "Zoom Out",
      shortcut: "Ctrl+-",
      action: () => setZoom((z) => Math.max(0.25, (z ?? 1) - 0.1)),
    },
    {
      id: "zoom-reset",
      label: "Fit to Screen",
      shortcut: "Ctrl+0",
      action: () => setZoom(null),
    },
    {
      id: "deselect",
      label: "Deselect Element",
      shortcut: "Escape",
      action: () => setSelectedSelector(null),
    },
  ];

  if (!isHydrated)
    return <div className="p-8 text-center">Loading design editor...</div>;

  if (!resume) {
    return (
      <div className="p-8 text-center text-red-500">Resume not found.</div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-black overflow-hidden select-none">
      <DesignStyleInjector design={resume.design} />
      <DesignToolbar
        resume={resume}
        onUndo={history.undo}
        onRedo={history.redo}
        onReset={history.reset}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel (Global settings) */}
        <div className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col p-4 shrink-0 overflow-y-auto">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">
            Design Editor
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click any element on the resume canvas to edit its properties,
            typography, color, and position.
          </p>

          <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
              Shortcuts
            </h3>
            <ul className="text-xs text-gray-500 space-y-1.5">
              <li>
                <kbd className="bg-gray-100 dark:bg-neutral-900 px-1 rounded">
                  Click
                </kbd>{" "}
                Select element
              </li>
              <li>
                <kbd className="bg-gray-100 dark:bg-neutral-900 px-1 rounded">
                  Esc
                </kbd>{" "}
                Deselect
              </li>
              <li>
                <kbd className="bg-gray-100 dark:bg-neutral-900 px-1 rounded">
                  Arrow keys
                </kbd>{" "}
                Nudge 2px
              </li>
              <li>
                <kbd className="bg-gray-100 dark:bg-neutral-900 px-1 rounded">
                  Shift+Arrow
                </kbd>{" "}
                Nudge 10px
              </li>
              <li>
                <kbd className="bg-gray-100 dark:bg-neutral-900 px-1 rounded">
                  Ctrl+Z
                </kbd>{" "}
                Undo
              </li>
              <li>
                <kbd className="bg-gray-100 dark:bg-neutral-900 px-1 rounded">
                  Ctrl+Y
                </kbd>{" "}
                Redo
              </li>
              <li>
                <kbd className="bg-gray-100 dark:bg-neutral-900 px-1 rounded">
                  ?
                </kbd>{" "}
                All shortcuts
              </li>
            </ul>
          </div>
        </div>

        {/* Canvas Center */}
        <div className="flex-1 relative bg-gray-100 dark:bg-neutral-900/50 overflow-hidden flex flex-col">
          <DesignCanvas
            resume={resume}
            selectedSelector={selectedSelector}
            onSelect={setSelectedSelector}
            externalZoom={zoom}
            onZoomChange={handleZoomChange}
            onOpenShortcuts={() => setShowShortcuts(true)}
          />
        </div>

        {/* Right Panel (Element Properties) */}
        <div className="w-80 bg-white dark:bg-black border-l border-gray-200 dark:border-gray-800 flex flex-col shrink-0 overflow-y-auto z-10">
          <DesignSidebar resume={resume} selectedSelector={selectedSelector} />
        </div>
      </div>

      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        commands={commands}
      />
    </div>
  );
}
