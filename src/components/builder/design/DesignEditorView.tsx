"use client";

import { useResume } from "@/hooks/useResume";
import { useState, useEffect, useRef } from "react";
import { DesignConfig } from "@/types/resume";
import { DesignToolbar } from "./DesignToolbar";
import { DesignCanvas } from "./DesignCanvas";
import { DesignSidebar } from "./DesignSidebar";
import { DesignStyleInjector } from "./DesignStyleInjector";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import { CommandPalette, CommandItem } from "./CommandPalette";

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

  const syncState = () => {
    setCanUndo(currentIndexRef.current > 0);
    setCanRedo(currentIndexRef.current < historyRef.current.length - 1);
  };

  const undo = () => {
    if (currentIndexRef.current > 0) {
      currentIndexRef.current -= 1;
      isUndoRedoAction.current = true;
      updateDesign(resumeId, historyRef.current[currentIndexRef.current]);
      syncState();
    }
  };

  const redo = () => {
    if (currentIndexRef.current < historyRef.current.length - 1) {
      currentIndexRef.current += 1;
      isUndoRedoAction.current = true;
      updateDesign(resumeId, historyRef.current[currentIndexRef.current]);
      syncState();
    }
  };

  const reset = () => {
    resetDesign(resumeId);
  };

  // Initialize
  useEffect(() => {
    if (historyRef.current.length === 0 && currentDesign) {
      historyRef.current = [JSON.parse(JSON.stringify(currentDesign))];
      currentIndexRef.current = 0;
      syncState();
    }
  }, [currentDesign]);

  // Debounced save
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
        // truncate future
        historyRef.current = historyRef.current.slice(
          0,
          currentIndexRef.current + 1,
        );
        historyRef.current.push(currentSnapshot);
        currentIndexRef.current = historyRef.current.length - 1;
        syncState();
      }
    }, 500); // 500ms debounce ensures dragging only saves the final state
  }, [currentDesign]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        // Undo
        if (currentIndexRef.current > 0) {
          currentIndexRef.current -= 1;
          isUndoRedoAction.current = true;
          updateDesign(resumeId, historyRef.current[currentIndexRef.current]);
          syncState();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        // Redo
        if (currentIndexRef.current < historyRef.current.length - 1) {
          currentIndexRef.current += 1;
          isUndoRedoAction.current = true;
          updateDesign(resumeId, historyRef.current[currentIndexRef.current]);
          syncState();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resumeId, updateDesign]);

  return { undo, redo, reset, canUndo, canRedo };
}

export function DesignEditorView({ resumeId }: { resumeId: string }) {
  const { resumes, isHydrated, updateDesign, resetDesign } = useResume();
  const [selectedSelector, setSelectedSelector] = useState<string | null>(null);

  const resume = resumes.find((r) => r.id === resumeId);

  // Hook up Undo/Redo design history unconditionally
  const history = useDesignHistory(
    resumeId,
    resume?.design,
    updateDesign,
    resetDesign,
  );

  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  useEffect(() => {
    if (!resume) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent triggering if typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (e.key === "?" || (e.ctrlKey && e.key === "/")) {
        e.preventDefault();
        setShowShortcuts(true);
      }

      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCommandPalette(true);
      }

      // Global formatting overrides when an element is selected
      if (e.ctrlKey && e.key.toLowerCase() === "b" && selectedSelector) {
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
      }

      if (e.ctrlKey && e.key.toLowerCase() === "i" && selectedSelector) {
        e.preventDefault();
        const currentS = resume.design?.elements?.[selectedSelector]?.fontStyle;
        updateDesign(resume.id, {
          elements: {
            [selectedSelector]: {
              fontStyle: currentS === "italic" ? "normal" : "italic",
            },
          },
        });
      }

      if (e.ctrlKey && e.key.toLowerCase() === "u" && selectedSelector) {
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
      }

      // Arrow key fine-movement
      if (
        (e.key === "ArrowUp" ||
          e.key === "ArrowDown" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight") &&
        selectedSelector
      ) {
        e.preventDefault(); // Prevent page scrolling
        const currentX = resume.design?.elements?.[selectedSelector]?.x || 0;
        const currentY = resume.design?.elements?.[selectedSelector]?.y || 0;

        let newX = currentX;
        let newY = currentY;
        const moveAmount = e.shiftKey ? 10 : 2; // Fine control (2px), or Shift for 10px

        if (e.key === "ArrowUp") newY -= moveAmount;
        if (e.key === "ArrowDown") newY += moveAmount;
        if (e.key === "ArrowLeft") newX -= moveAmount;
        if (e.key === "ArrowRight") newX += moveAmount;

        updateDesign(resume.id, {
          elements: {
            [selectedSelector]: {
              x: newX,
              y: newY,
            },
          },
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resume, selectedSelector, updateDesign]);

  const commands: CommandItem[] = [
    {
      id: "save",
      label: "Save Design",
      shortcut: "Ctrl+S",
      action: () => alert("Design saved."),
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
  ];

  if (!isHydrated)
    return <div className="p-8 text-center">Loading design editor...</div>;

  if (!resume) {
    return (
      <div className="p-8 text-center text-red-500">Resume not found.</div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden select-none">
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
        {/* Left Panel (Optional themes/global settings) */}
        <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col p-4 shrink-0 overflow-y-auto">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">
            Design Editor
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click any element on the resume canvas to edit its properties,
            typography, color, and position.
          </p>

          <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
              Global Settings
            </h3>
            {/* Future global settings like paper size, global typography */}
            <p className="text-xs text-gray-500 italic">
              Select an element on the canvas to begin.
            </p>
          </div>
        </div>

        {/* Canvas Center */}
        <div className="flex-1 relative bg-gray-100 dark:bg-gray-800/50 overflow-hidden flex flex-col">
          <DesignCanvas
            resume={resume}
            selectedSelector={selectedSelector}
            onSelect={setSelectedSelector}
          />
        </div>

        {/* Right Panel (Element Properties) */}
        <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col shrink-0 overflow-y-auto z-10">
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
