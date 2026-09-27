export function getUniqueSelector(
  el: HTMLElement,
  containerId: string,
): string | null {
  if (el.id === containerId) return null;

  const path: string[] = [];
  let current: HTMLElement | null = el;

  while (
    current &&
    current.id !== containerId &&
    current.tagName.toLowerCase() !== "body"
  ) {
    let selector = current.tagName.toLowerCase();

    // Calculate nth-child
    let index = 1;
    let sibling = current.previousElementSibling;
    while (sibling) {
      index++;
      sibling = sibling.previousElementSibling;
    }

    selector += `:nth-child(${index})`;
    path.unshift(selector);
    current = current.parentElement;
  }

  if (
    !current ||
    (current.id !== containerId && current.tagName.toLowerCase() === "body")
  ) {
    return null; // The element is not inside the container
  }

  return `#${containerId} > ` + path.join(" > ");
}

export function getPaintedTransform(el: HTMLElement) {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  const style = window.getComputedStyle(el);
  if (style.transform === "none") return { x: 0, y: 0 };
  try {
    const matrix = new DOMMatrixReadOnly(style.transform);
    return { x: matrix.m41, y: matrix.m42 };
  } catch {
    return { x: 0, y: 0 };
  }
}

export function getPaperScale(containerId: string): number {
  if (typeof window === "undefined") return 1;
  const paper = document.getElementById(containerId);
  if (!paper) return 1;
  const style = window.getComputedStyle(paper);
  if (style.transform === "none") return 1;
  try {
    const matrix = new DOMMatrixReadOnly(style.transform);
    return matrix.m11 || 1;
  } catch {
    return 1;
  }
}

export function checkOverlap(
  el: HTMLElement,
  dx: number,
  dy: number,
  containerId: string,
  scale: number = 1,
): boolean {
  if (!el || typeof document === "undefined") return false;

  const container = document.getElementById(containerId);
  if (!container) return false;

  const rect = el.getBoundingClientRect();

  const scaledDx = dx * scale;
  const scaledDy = dy * scale;

  const virtualRect = {
    left: rect.left + scaledDx,
    right: rect.right + scaledDx,
    top: rect.top + scaledDy,
    bottom: rect.bottom + scaledDy,
  };

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_ELEMENT,
    null,
  );
  let node = walker.nextNode() as HTMLElement;

  while (node) {
    if (el.contains(node) || node.contains(el)) {
      node = walker.nextNode() as HTMLElement;
      continue;
    }

    const isLeafOrRelevant =
      (node.childElementCount === 0 &&
        (node.textContent?.trim().length || 0) > 0) ||
      node.tagName.toLowerCase() === "svg" ||
      node.tagName.toLowerCase() === "img" ||
      node.hasAttribute("data-element");

    if (isLeafOrRelevant) {
      // Use 0 deflate for strict boundaries to prevent ANY visual overlap.
      const deflate = 0;
      const otherRect = node.getBoundingClientRect();

      const vLeft = virtualRect.left + deflate;
      const vRight = virtualRect.right - deflate;
      const vTop = virtualRect.top + deflate;
      const vBottom = virtualRect.bottom - deflate;

      const oLeft = otherRect.left + deflate;
      const oRight = otherRect.right - deflate;
      const oTop = otherRect.top + deflate;
      const oBottom = otherRect.bottom - deflate;

      // Ignore if deflated rect is invalid (element too small)
      if (
        vRight <= vLeft ||
        vBottom <= vTop ||
        oRight <= oLeft ||
        oBottom <= oTop
      ) {
        continue;
      }

      const overlaps = !(
        vRight <= oLeft ||
        vLeft >= oRight ||
        vBottom <= oTop ||
        vTop >= oBottom
      );

      const currentlyOverlaps = !(
        rect.right - deflate <= oLeft ||
        rect.left + deflate >= oRight ||
        rect.bottom - deflate <= oTop ||
        rect.top + deflate >= oBottom
      );

      const getArea = (
        r1: { left: number; right: number; top: number; bottom: number },
        r2: { left: number; right: number; top: number; bottom: number },
      ) => {
        const xOverlap = Math.max(
          0,
          Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left),
        );
        const yOverlap = Math.max(
          0,
          Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top),
        );
        return xOverlap * yOverlap;
      };

      if (overlaps) {
        if (!currentlyOverlaps) return true;

        const currentArea = getArea(
          {
            left: rect.left + deflate,
            right: rect.right - deflate,
            top: rect.top + deflate,
            bottom: rect.bottom - deflate,
          },
          { left: oLeft, right: oRight, top: oTop, bottom: oBottom },
        );
        const newArea = getArea(
          { left: vLeft, right: vRight, top: vTop, bottom: vBottom },
          { left: oLeft, right: oRight, top: oTop, bottom: oBottom },
        );
        if (newArea > currentArea) return true;
      }
    }

    node = walker.nextNode() as HTMLElement;
  }

  return false;
}
