"use client";

import { Resume, ElementDesign } from "@/types/resume";
import { useResume } from "@/hooks/useResume";
import { Type, Palette, Move, BoxSelect } from "lucide-react";

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
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                  Align
                </label>
                <select
                  value={currentDesign.textAlign || ""}
                  onChange={(e) => handleUpdate({ textAlign: e.target.value })}
                  className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800"
                >
                  <option value="">Default</option>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                  Transform
                </label>
                <select
                  value={currentDesign.textTransform || ""}
                  onChange={(e) =>
                    handleUpdate({ textTransform: e.target.value })
                  }
                  className="w-full text-sm border border-gray-300 dark:border-gray-700 rounded-md p-1.5 bg-gray-50 dark:bg-gray-800"
                >
                  <option value="">Default</option>
                  <option value="none">None</option>
                  <option value="uppercase">Uppercase</option>
                  <option value="capitalize">Capitalize</option>
                  <option value="lowercase">Lowercase</option>
                </select>
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
      </div>
    </div>
  );
}
