"use client";

import React from "react";
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
  Eye,
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

  let isQR = false;
  if (typeof document !== "undefined") {
    const el = document.querySelector(selectedSelector);
    if (el && el.closest('[data-element="qr-code"]')) {
      isQR = true;
    }
  }

  if (isQR) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500 dark:text-gray-400">
        <BoxSelect className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          QR Code Selected
        </p>
        <p className="text-sm">You can not edit or move QR.</p>
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
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-neutral-950 overflow-y-auto border-l border-gray-200 dark:border-neutral-800 shadow-xl">
      <div className="p-5 border-b border-gray-200 dark:border-neutral-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md z-10">
        <h2 className="font-bold text-gray-900 dark:text-white text-sm tracking-wide">
          Properties
        </h2>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {/* Typography Section */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
            <Type className="w-4 h-4" /> Typography
          </h3>
          <div className="grid gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                Font Family
              </label>
              <select
                value={currentDesign.fontFamily || ""}
                onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
                className="w-full text-sm border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              >
                <option value="">Default Theme Font</option>
                {FONTS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                  Size
                </label>
                <select
                  value={currentDesign.fontSize || ""}
                  onChange={(e) => handleUpdate({ fontSize: e.target.value })}
                  className="w-full text-sm border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="">Auto</option>
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                  Weight
                </label>
                <select
                  value={currentDesign.fontWeight || ""}
                  onChange={(e) => handleUpdate({ fontWeight: e.target.value })}
                  className="w-full text-sm border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="">Auto</option>
                  {WEIGHTS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 mt-1">
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                  Style & Formatting
                </label>
                <div className="flex bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg overflow-hidden shadow-sm">
                  {[
                    {
                      key: "fontWeight",
                      icon: Bold,
                      value: "bold",
                      default: "normal",
                      title: "Bold (Ctrl+B)",
                    },
                    {
                      key: "fontStyle",
                      icon: Italic,
                      value: "italic",
                      default: "normal",
                      title: "Italic (Ctrl+I)",
                    },
                    {
                      key: "textDecoration",
                      icon: Underline,
                      value: "underline",
                      default: "none",
                      title: "Underline (Ctrl+U)",
                    },
                  ].map((btn, i) => (
                    <React.Fragment key={btn.key}>
                      <button
                        onClick={() =>
                          handleUpdate({
                            [btn.key]:
                              currentDesign[
                                btn.key as keyof typeof currentDesign
                              ] === btn.value
                                ? btn.default
                                : btn.value,
                          })
                        }
                        className={`flex-1 py-2 flex justify-center transition-all ${currentDesign[btn.key as keyof typeof currentDesign] === btn.value ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "text-gray-500 hover:bg-gray-200 dark:hover:bg-neutral-800"}`}
                        title={btn.title}
                      >
                        <btn.icon className="w-4 h-4" />
                      </button>
                      {i < 2 && (
                        <div className="w-px bg-gray-300 dark:bg-neutral-700" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="col-span-2 mt-1">
                <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                  Alignment
                </label>
                <div className="flex bg-gray-50 dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 rounded-lg overflow-hidden shadow-sm">
                  {[
                    { align: "left", icon: AlignLeft, title: "Align Left" },
                    {
                      align: "center",
                      icon: AlignCenter,
                      title: "Align Center",
                    },
                    { align: "right", icon: AlignRight, title: "Align Right" },
                    { align: "justify", icon: AlignJustify, title: "Justify" },
                  ].map((btn, i) => (
                    <React.Fragment key={btn.align}>
                      <button
                        onClick={() => handleUpdate({ textAlign: btn.align })}
                        className={`flex-1 py-2 flex justify-center transition-all ${currentDesign.textAlign === btn.align ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "text-gray-500 hover:bg-gray-200 dark:hover:bg-neutral-800"}`}
                        title={btn.title}
                      >
                        <btn.icon className="w-4 h-4" />
                      </button>
                      {i < 3 && (
                        <div className="w-px bg-gray-300 dark:bg-neutral-700" />
                      )}
                    </React.Fragment>
                  ))}
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
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                Text Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentDesign.color || "#000000"}
                  onChange={(e) => handleUpdate({ color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={currentDesign.color || ""}
                  onChange={(e) => handleUpdate({ color: e.target.value })}
                  placeholder="#000000"
                  className="flex-1 text-sm border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                Background Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={currentDesign.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    handleUpdate({ backgroundColor: e.target.value })
                  }
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={currentDesign.backgroundColor || ""}
                  onChange={(e) =>
                    handleUpdate({ backgroundColor: e.target.value })
                  }
                  placeholder="transparent"
                  className="flex-1 text-sm border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none uppercase font-mono"
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
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                X Offset (px)
              </label>
              <input
                type="number"
                value={currentDesign.x || 0}
                onChange={(e) =>
                  handleUpdate({ x: parseInt(e.target.value) || 0 })
                }
                className="w-full text-sm border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                Y Offset (px)
              </label>
              <input
                type="number"
                value={currentDesign.y || 0}
                onChange={(e) =>
                  handleUpdate({ y: parseInt(e.target.value) || 0 })
                }
                className="w-full text-sm border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                Margin
              </label>
              <input
                type="text"
                placeholder="0px"
                value={currentDesign.margin || ""}
                onChange={(e) => handleUpdate({ margin: e.target.value })}
                className="w-full text-sm border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                Padding
              </label>
              <input
                type="text"
                placeholder="0px"
                value={currentDesign.padding || ""}
                onChange={(e) => handleUpdate({ padding: e.target.value })}
                className="w-full text-sm border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
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
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                Border
              </label>
              <input
                type="text"
                placeholder="1px solid #000"
                value={currentDesign.border || ""}
                onChange={(e) => handleUpdate({ border: e.target.value })}
                className="w-full text-sm border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                Corner Radius
              </label>
              <select
                value={currentDesign.borderRadius || ""}
                onChange={(e) => handleUpdate({ borderRadius: e.target.value })}
                className="w-full text-sm border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
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
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 flex justify-between mb-2 uppercase tracking-wider">
                <span>Opacity</span>
                <span className="text-blue-600 dark:text-blue-400">
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
            <div className="col-span-2 mt-2">
              <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 uppercase tracking-wider">
                Shadow
              </label>
              <select
                value={currentDesign.boxShadow || ""}
                onChange={(e) => handleUpdate({ boxShadow: e.target.value })}
                className="w-full text-sm border border-gray-300 dark:border-neutral-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
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

        {/* Additional Actions */}
        <section className="pb-8 border-t border-gray-200 dark:border-neutral-800 pt-6 mt-2">
          <div className="space-y-3">
            <button
              onClick={() =>
                handleUpdate({
                  visibility:
                    currentDesign.visibility === "hidden"
                      ? "visible"
                      : "hidden",
                })
              }
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all text-sm font-semibold border ${currentDesign.visibility === "hidden" ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/50" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:shadow-sm dark:bg-neutral-900 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-800"}`}
              title={
                currentDesign.visibility === "hidden"
                  ? "Show Element"
                  : "Hide Element"
              }
            >
              {currentDesign.visibility === "hidden" ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              {currentDesign.visibility === "hidden"
                ? "Show Element"
                : "Hide Element"}
            </button>

            <button
              onClick={() =>
                updateDesign(resume.id, {
                  elements: { [selectedSelector]: {} },
                })
              }
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all text-sm font-semibold border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-sm dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/40"
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
