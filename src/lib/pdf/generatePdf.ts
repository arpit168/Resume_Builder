import { getSafeFontCss } from "./inlineStyles";

export async function generateResumePdf(
  element: HTMLElement,
  filename: string,
) {
  const { toCanvas } = await import("html-to-image");
  const { jsPDF } = await import("jspdf");

  const originalTransform = element.style.transform;
  element.style.transform = "scale(1)";

  await new Promise((resolve) => setTimeout(resolve, 100));

  const safeFontCss = getSafeFontCss();

  const sourceCanvas = await toCanvas(element, {
    quality: 0.98,
    backgroundColor: "#ffffff",
    pixelRatio: 2,
    fontEmbedCSS: safeFontCss,
  });

  element.style.transform = originalTransform;

  const a4WidthMm = 210;
  const a4HeightMm = 297;
  const pxPerMm = sourceCanvas.width / a4WidthMm;

  const bottomMarginMm = 10;
  const topMarginMm = 10; // For page 2+

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
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
    return targetY;
  };

  while (yOffset < sourceCanvas.height) {
    if (pageNum > 1) pdf.addPage();

    const currentTopMarginMm = pageNum > 1 ? topMarginMm : 0;
    const availableHeightMm = a4HeightMm - currentTopMarginMm - bottomMarginMm;
    const maxSlicePx = availableHeightMm * pxPerMm;

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

    const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.98);
    const printHeightMm = sliceHeight / pxPerMm;

    pdf.addImage(
      sliceData,
      "JPEG",
      0,
      currentTopMarginMm,
      a4WidthMm,
      printHeightMm,
    );

    sliceHeights.push(sliceHeight);
    yOffset += sliceHeight;
    pageNum++;
  }

  // Add clickable links programmatically
  const links = element.querySelectorAll("a");
  const elementRect = element.getBoundingClientRect();
  const pxRatio = sourceCanvas.width / elementRect.width;

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
    let pageSliceHeight = sliceHeights[0];

    while (
      pNum <= sliceHeights.length &&
      canvasY >= currentSliceY + pageSliceHeight
    ) {
      currentSliceY += pageSliceHeight;
      pNum++;
      pageSliceHeight = sliceHeights[pNum - 1];
    }

    if (pNum <= sliceHeights.length) {
      const yOnPageCanvas = canvasY - currentSliceY;

      const pageTopMarginMm = pNum > 1 ? topMarginMm : 0;

      const mmX = canvasX / pxPerMm;
      const mmY = yOnPageCanvas / pxPerMm + pageTopMarginMm;
      const mmW = canvasW / pxPerMm;
      const mmH = canvasH / pxPerMm;

      pdf.setPage(pNum);
      pdf.link(mmX, mmY, mmW, mmH, { url: href });
    }
  });

  pdf.save(filename);
}
