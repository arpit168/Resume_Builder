import { getSafeFontCss } from "./inlineStyles";
import {
  extractDomTextItems,
  generateAtsItemsFromData,
  sortItemsByAtsOrder,
} from "./extractDomText";
import { AtsTextItem } from "./types";
import { ResumeData } from "@/types/resume";

export async function generateResumePdf(
  element: HTMLElement,
  filename: string,
  resumeData?: ResumeData,
) {
  const { toCanvas } = await import("html-to-image");
  const { jsPDF } = await import("jspdf");

  const originalTransform = element.style.transform;
  element.style.transform = "scale(1)";

  await new Promise((resolve) => setTimeout(resolve, 100));

  const a4WidthMm = 210;
  const a4HeightMm = 297;
  const elementRect = element.getBoundingClientRect();
  const domPxPerMm =
    elementRect.width > 0 ? elementRect.width / a4WidthMm : 794 / a4WidthMm;

  // 1. Extract text items from DOM before changing styles
  let rawTextItems: AtsTextItem[] = [];
  try {
    rawTextItems = extractDomTextItems(element, domPxPerMm);
  } catch (err) {
    console.warn(
      "Failed to extract DOM text items, falling back to data:",
      err,
    );
  }

  // Fallback if DOM was empty (e.g. headless/test environment)
  if (rawTextItems.length === 0 && resumeData) {
    rawTextItems = generateAtsItemsFromData(resumeData);
  }

  const safeFontCss = getSafeFontCss();

  let sourceCanvas: HTMLCanvasElement;
  try {
    sourceCanvas = await toCanvas(element, {
      quality: 0.98,
      backgroundColor: "#ffffff",
      pixelRatio: 2,
      fontEmbedCSS: safeFontCss,
    });
  } catch (canvasErr) {
    console.warn(
      "Failed to render canvas with html-to-image, using blank canvas fallback:",
      canvasErr,
    );
    sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = 794 * 2;
    sourceCanvas.height = 1123 * 2;
    const ctx = sourceCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, sourceCanvas.width, sourceCanvas.height);
    }
  }

  element.style.transform = originalTransform;

  const canvasPxPerMm = sourceCanvas.width / a4WidthMm;
  const bottomMarginMm = 10;
  const topMarginMm = 10; // For page 2+

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: false, // Leave uncompressed for instant stream readability by ATS parsers
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

    try {
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
    } catch {
      // In case getImageData is restricted or unavailable
      return targetY;
    }
    return targetY;
  };

  while (yOffset < sourceCanvas.height) {
    if (pageNum > 1) pdf.addPage();

    const currentTopMarginMm = pageNum > 1 ? topMarginMm : 0;
    const availableHeightMm = a4HeightMm - currentTopMarginMm - bottomMarginMm;
    const maxSlicePx = availableHeightMm * canvasPxPerMm;

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

    let sliceData = "";
    try {
      sliceData = sliceCanvas.toDataURL("image/jpeg", 0.98);
    } catch {
      sliceData = "";
    }

    const printHeightMm = sliceHeight / canvasPxPerMm;

    if (
      sliceData &&
      typeof sliceData === "string" &&
      sliceData.startsWith("data:image")
    ) {
      try {
        pdf.addImage(
          sliceData,
          "JPEG",
          0,
          currentTopMarginMm,
          a4WidthMm,
          printHeightMm,
        );
      } catch (imgErr) {
        console.warn("Failed to add image slice to PDF:", imgErr);
      }
    }

    sliceHeights.push(sliceHeight);
    yOffset += sliceHeight;
    pageNum++;
  }

  // 2. Map and add real text layer for ATS compatibility
  // Assign each text item to its corresponding page slice
  const pageItemsMap = new Map<number, AtsTextItem[]>();
  for (let i = 1; i <= sliceHeights.length; i++) {
    pageItemsMap.set(i, []);
  }

  for (const item of rawTextItems) {
    const itemCanvasY = item.y * canvasPxPerMm;

    let pNum = 1;
    let currentSliceY = 0;
    let pageSliceHeight = sliceHeights[0] || a4HeightMm * canvasPxPerMm;

    while (
      pNum <= sliceHeights.length &&
      itemCanvasY >= currentSliceY + pageSliceHeight
    ) {
      currentSliceY += pageSliceHeight;
      pNum++;
      pageSliceHeight = sliceHeights[pNum - 1] ?? pageSliceHeight;
    }

    if (pNum <= sliceHeights.length) {
      const yOnPageCanvas = itemCanvasY - currentSliceY;
      const pageTopMarginMm = pNum > 1 ? topMarginMm : 0;
      const localMmY = yOnPageCanvas / canvasPxPerMm + pageTopMarginMm;

      const pageList = pageItemsMap.get(pNum);
      if (pageList) {
        pageList.push({
          ...item,
          y: localMmY,
        });
      }
    }
  }

  // Render text items page by page in ATS reading order
  for (let p = 1; p <= sliceHeights.length; p++) {
    const pageItems = pageItemsMap.get(p) || [];
    const sortedPageItems = sortItemsByAtsOrder(pageItems);

    pdf.setPage(p);

    for (const item of sortedPageItems) {
      let fontStyle: "normal" | "bold" | "italic" | "bolditalic" = "normal";
      if (item.fontWeight === "bold" && item.fontStyle === "italic") {
        fontStyle = "bolditalic";
      } else if (item.fontWeight === "bold") {
        fontStyle = "bold";
      } else if (item.fontStyle === "italic") {
        fontStyle = "italic";
      }

      pdf.setFont(item.fontFamily, fontStyle);
      pdf.setFontSize(item.fontSizePt);

      // Rendering mode 'invisible' (PDF 3 Tr) produces native PDF text operators
      // that are 100% extractable by ATS parsers and selectable in PDF viewers,
      // without double-rendering glyph outlines over the visual canvas.
      pdf.text(item.text, Math.max(item.x, 0), item.y, {
        renderingMode: "invisible",
        baseline: "top",
        maxWidth: Math.max(item.width, 10),
      });
    }
  }

  // 3. Add clickable links programmatically
  const links = element.querySelectorAll("a");
  const pxRatio = sourceCanvas.width / (elementRect.width || 794);

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
    let pageSliceHeight = sliceHeights[0] || a4HeightMm * canvasPxPerMm;

    while (
      pNum <= sliceHeights.length &&
      canvasY >= currentSliceY + pageSliceHeight
    ) {
      currentSliceY += pageSliceHeight;
      pNum++;
      pageSliceHeight = sliceHeights[pNum - 1] ?? pageSliceHeight;
    }

    if (pNum <= sliceHeights.length) {
      const yOnPageCanvas = canvasY - currentSliceY;
      const pageTopMarginMm = pNum > 1 ? topMarginMm : 0;

      const mmX = canvasX / canvasPxPerMm;
      const mmY = yOnPageCanvas / canvasPxPerMm + pageTopMarginMm;
      const mmW = canvasW / canvasPxPerMm;
      const mmH = canvasH / canvasPxPerMm;

      pdf.setPage(pNum);
      pdf.link(mmX, mmY, mmW, mmH, { url: href });
    }
  });

  // 4. Set ATS-friendly document metadata properties
  if (resumeData) {
    const fullName = resumeData.personalInfo.fullName || "Resume";
    const jobTitle = resumeData.personalInfo.jobTitle || "Resume";
    const keywords = resumeData.skills?.map((s) => s.name).join(", ") || "";

    pdf.setProperties({
      title: `${fullName} - Resume`,
      subject: jobTitle,
      author: fullName,
      keywords,
      creator: "Hire-Craft Resume Builder",
    });
  }

  pdf.save(filename);
  return pdf;
}
