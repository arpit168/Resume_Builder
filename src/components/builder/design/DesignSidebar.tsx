"use client";

import { Resume, ElementDesign } from "@/types/resume";
import { useResume } from "@/hooks/useResume";
import {
  Type,
  Palette,
  Move,
  BoxSelect,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Square,
  Sparkles,
  Layers,
  EyeOff,
  Trash2,
} from "lucide-react";

export function DesignSidebar({
  resume,
  selectedSelector,
}: {
  resume: Resume;
  selectedSelector: string | null;
}) {
  const { updateDesign } = useResume();
  const currentDesign: ElementDesign = selectedSelector
    ? resume.design?.elements?.[selectedSelector] || {}
    : {};

  const handleUpdate = (updates: Partial<ElementDesign>) => {
    if (!selectedSelector) return;
    updateDesign(resume.id, {
      elements: {
        [selectedSelector]: {
          ...currentDesign,
          ...updates,
        },
      },
    });
  };

  const resetElement = () => {
    if (!selectedSelector) return;
    updateDesign(resume.id, {
      elements: {
        [selectedSelector]: {},
      },
    });
  };

  if (!selectedSelector) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500 dark:text-gray-400">
        <BoxSelect className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm">
          Select any element on the resume to start editing its design.
        </p>
      </div>
    );
  }

  // Predefined options
  const FONTS = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Inter",
    "Roboto",
    "Poppins",
    "Lato",
    "Montserrat",
  ];
  const SIZES = [
    "10px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "30px",
    "36px",
    "48px",
  ];
  const WEIGHTS = ["300", "400", "500", "600", "700", "800"];

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-900 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
        <h2 className="font-bold text-gray-900 dark:text-white text-sm">
          Element Properties
        </h2>
        <button
          onClick={resetElement}
          className="text-xs text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 px-2 py-1 rounded"
        >
          Reset
        </button>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {/* Typography Section */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
            <Type className="w-4 h-4" /> Typography
          </h3>
          <div className="grid gap-3">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                Font Family
              </label>
              <select
                value={currentDesign.fontFamily?.replace(/['"]/g, "") || ""}
                onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
                className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800"
              >
                <option value="">Default</option>
                {FONTS.map((f) => (
                  <option key={f} value={`'${f}', sans-serif`}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                  Size
                </label>
                <select
                  value={currentDesign.fontSize || ""}
                  onChange={(e) => handleUpdate({ fontSize: e.target.value })}
                  className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800"
                >
                  <option value="">Default</option>
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                  Weight
                </label>
                <select
                  value={currentDesign.fontWeight || ""}
                  onChange={(e) => handleUpdate({ fontWeight: e.target.value })}
                  className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800"
                >
                  <option value="">Default</option>
                  {WEIGHTS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                  Style & Formatting
                </label>
                <div className="flex bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                  <button
                    onClick={() =>
                      handleUpdate({
                        fontWeight:
                          currentDesign.fontWeight === "bold"
                            ? "normal"
                            : "bold",
                      })
                    }
                    className={`flex-1 p-1.5 flex justify-center transition-colors ${currentDesign.fontWeight === "bold" ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`}
                    title="Bold (Ctrl+B)"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <div className="w-px bg-gray-300 dark:bg-gray-700" />
                  <button
                    onClick={() =>
                      handleUpdate({
                        fontStyle:
                          currentDesign.fontStyle === "italic"
                            ? "normal"
                            : "italic",
                      })
                    }
                    className={`flex-1 p-1.5 flex justify-center transition-colors ${currentDesign.fontStyle === "italic" ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`}
                    title="Italic (Ctrl+I)"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <div className="w-px bg-gray-300 dark:bg-gray-700" />
                  <button
                    onClick={() =>
                      handleUpdate({
                        textDecoration:
                          currentDesign.textDecoration === "underline"
                            ? "none"
                            : "underline",
                      })
                    }
                    className={`flex-1 p-1.5 flex justify-center transition-colors ${currentDesign.textDecoration === "underline" ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`}
                    title="Underline (Ctrl+U)"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                  Alignment
                </label>
                <div className="flex bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                  <button
                    onClick={() => handleUpdate({ textAlign: "left" })}
                    className={`flex-1 p-1.5 flex justify-center transition-colors ${currentDesign.textAlign === "left" ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`}
                    title="Align Left"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <div className="w-px bg-gray-300 dark:bg-gray-700" />
                  <button
                    onClick={() => handleUpdate({ textAlign: "center" })}
                    className={`flex-1 p-1.5 flex justify-center transition-colors ${currentDesign.textAlign === "center" ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`}
                    title="Align Center"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <div className="w-px bg-gray-300 dark:bg-gray-700" />
                  <button
                    onClick={() => handleUpdate({ textAlign: "right" })}
                    className={`flex-1 p-1.5 flex justify-center transition-colors ${currentDesign.textAlign === "right" ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`}
                    title="Align Right"
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <div className="w-px bg-gray-300 dark:bg-gray-700" />
                  <button
                    onClick={() => handleUpdate({ textAlign: "justify" })}
                    className={`flex-1 p-1.5 flex justify-center transition-colors ${currentDesign.textAlign === "justify" ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50"}`}
                    title="Justify"
                  >
                    <AlignJustify className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Color Section */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4" /> Colors
          </h3>
          <div className="grid gap-3">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                Text Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentDesign.color || "#000000"}
                  onChange={(e) => handleUpdate({ color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                />
                <input
                  type="text"
                  value={currentDesign.color || ""}
                  onChange={(e) => handleUpdate({ color: e.target.value })}
                  placeholder="#000000"
                  className="flex-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800 uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                Background Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentDesign.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    handleUpdate({ backgroundColor: e.target.value })
                  }
                  className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                />
                <input
                  type="text"
                  value={currentDesign.backgroundColor || ""}
                  onChange={(e) =>
                    handleUpdate({ backgroundColor: e.target.value })
                  }
                  placeholder="transparent"
                  className="flex-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800 uppercase"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Position / Spacing */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
            <Move className="w-4 h-4" /> Position & Spacing
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                X Offset (px)
              </label>
              <input
                type="number"
                value={currentDesign.x || 0}
                onChange={(e) =>
                  handleUpdate({ x: parseInt(e.target.value) || 0 })
                }
                className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                Y Offset (px)
              </label>
              <input
                type="number"
                value={currentDesign.y || 0}
                onChange={(e) =>
                  handleUpdate({ y: parseInt(e.target.value) || 0 })
                }
                className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                Margin
              </label>
              <input
                type="text"
                placeholder="0px 0px"
                value={currentDesign.margin || ""}
                onChange={(e) => handleUpdate({ margin: e.target.value })}
                className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                Padding
              </label>
              <input
                type="text"
                placeholder="0px 0px"
                value={currentDesign.padding || ""}
                onChange={(e) => handleUpdate({ padding: e.target.value })}
                className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800"
              />
            </div>
          </div>
        </section>

        {/* Borders */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
            <Square className="w-4 h-4" /> Borders & Corners
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                Border (e.g., 1px solid #000)
              </label>
              <input
                type="text"
                placeholder="none"
                value={currentDesign.border || ""}
                onChange={(e) => handleUpdate({ border: e.target.value })}
                className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                Corner Radius
              </label>
              <select
                value={currentDesign.borderRadius || ""}
                onChange={(e) => handleUpdate({ borderRadius: e.target.value })}
                className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800"
              >
                <option value="">Square (0px)</option>
                <option value="4px">Small (4px)</option>
                <option value="8px">Medium (8px)</option>
                <option value="16px">Large (16px)</option>
                <option value="9999px">Fully Rounded</option>
              </select>
            </div>
          </div>
        </section>

        {/* Effects */}
        <section className="pb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Effects
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-gray-600 dark:text-gray-400 block flex justify-between mb-1">
                <span>Opacity</span>
                <span>
                  {currentDesign.opacity !== undefined
                    ? Math.round(Number(currentDesign.opacity) * 100)
                    : 100}
                  %
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={
                  currentDesign.opacity !== undefined
                    ? currentDesign.opacity
                    : 1
                }
                onChange={(e) =>
                  handleUpdate({ opacity: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-600"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                Shadow
              </label>
              <select
                value={currentDesign.boxShadow || ""}
                onChange={(e) => handleUpdate({ boxShadow: e.target.value })}
                className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800"
              >
                <option value="">None</option>
                <option value="0 1px 2px 0 rgb(0 0 0 / 0.05)">Small</option>
                <option value="0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)">
                  Medium
                </option>
                <option value="0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)">
                  Large
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* Advanced Section */}
        <section className="pb-8 border-t border-gray-200 dark:border-gray-800 pt-6 mt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" /> Advanced
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Layer (Z-Index)
              </label>
              <input
                type="number"
                value={currentDesign.zIndex || 0}
                onChange={(e) =>
                  handleUpdate({ zIndex: parseInt(e.target.value) || 0 })
                }
                className="w-20 text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800 text-center"
              />
            </div>

            <button
              onClick={() =>
                handleUpdate({
                  visibility:
                    currentDesign.visibility === "hidden"
                      ? "visible"
                      : "hidden",
                })
              }
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors text-sm font-medium border ${currentDesign.visibility === "hidden" ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"}`}
            >
              {currentDesign.visibility === "hidden" ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              {currentDesign.visibility === "hidden"
                ? "Element Hidden"
                : "Hide Element"}
            </button>

            <button
              onClick={() =>
                updateDesign(resume.id, {
                  elements: { [selectedSelector]: {} },
                })
              }
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors text-sm font-medium border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/40"
            >
              <Trash2 className="w-4 h-4" />
              Reset All Formatting
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
