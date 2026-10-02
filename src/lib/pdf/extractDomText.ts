import { AtsSectionCategory, AtsTextItem } from "./types";
import { ResumeData } from "@/types/resume";

const CATEGORY_PRIORITY: Record<AtsSectionCategory, number> = {
  HEADER: 1,
  SUMMARY: 2,
  SKILLS: 3,
  EXPERIENCE: 4,
  PROJECTS: 5,
  EDUCATION: 6,
  CERTIFICATIONS: 7,
  ACHIEVEMENTS: 8,
  LANGUAGES: 9,
  CUSTOM: 10,
};

function detectCategoryFromText(text: string): AtsSectionCategory | null {
  const lower = text.toLowerCase();
  if (
    lower.includes("experience") ||
    lower.includes("employment") ||
    lower.includes("work history")
  ) {
    return "EXPERIENCE";
  }
  if (
    lower.includes("education") ||
    lower.includes("academic") ||
    lower.includes("degree")
  ) {
    return "EDUCATION";
  }
  if (
    lower.includes("skill") ||
    lower.includes("technologies") ||
    lower.includes("competencies")
  ) {
    return "SKILLS";
  }
  if (lower.includes("project")) {
    return "PROJECTS";
  }
  if (
    lower.includes("summary") ||
    lower.includes("profile") ||
    lower.includes("about me") ||
    lower.includes("objective")
  ) {
    return "SUMMARY";
  }
  if (
    lower.includes("certification") ||
    lower.includes("certificate") ||
    lower.includes("license")
  ) {
    return "CERTIFICATIONS";
  }
  if (
    lower.includes("achievement") ||
    lower.includes("award") ||
    lower.includes("honor")
  ) {
    return "ACHIEVEMENTS";
  }
  if (lower.includes("language")) {
    return "LANGUAGES";
  }
  return null;
}

function getElementCategory(
  el: HTMLElement,
  container: HTMLElement,
): AtsSectionCategory {
  // If element is H1 or H2, it's typically Candidate Name or Job Title -> HEADER
  const tagName = el.tagName.toUpperCase();
  if (tagName === "H1" || tagName === "H2") {
    return "HEADER";
  }

  // Check if ancestor is a header or if element is in the top section
  let curr: HTMLElement | null = el;
  while (curr && curr !== container) {
    // If inside a <section> or container, look for a section heading (h3, h4, h2)
    const heading = curr.querySelector("h2, h3, h4, h5");
    if (heading && heading !== el) {
      const detected = detectCategoryFromText(heading.textContent || "");
      if (detected) return detected;
    }

    // Check data-section attribute
    const dataSection = curr.getAttribute("data-section");
    if (dataSection) {
      const detected = detectCategoryFromText(dataSection);
      if (detected) return detected;
    }

    curr = curr.parentElement;
  }

  // Check preceding siblings for a section heading
  let sibling = el.previousElementSibling;
  while (sibling) {
    const heading = sibling.matches("h2, h3, h4, h5")
      ? sibling
      : sibling.querySelector("h2, h3, h4, h5");
    if (heading) {
      const detected = detectCategoryFromText(heading.textContent || "");
      if (detected) return detected;
    }
    sibling = sibling.previousElementSibling;
  }

  // Default to HEADER if before any section or near top, else CUSTOM
  return "HEADER";
}

function isLeafTextElement(el: HTMLElement): boolean {
  const tagName = el.tagName.toUpperCase();

  // Explicit text tags
  if (
    tagName === "H1" ||
    tagName === "H2" ||
    tagName === "H3" ||
    tagName === "H4" ||
    tagName === "H5" ||
    tagName === "H6" ||
    tagName === "P" ||
    tagName === "LI"
  ) {
    return true;
  }

  // For DIV, SPAN, A: check if children are only text or inline formatting elements
  const children = Array.from(el.children) as HTMLElement[];
  if (children.length === 0) {
    return true;
  }

  const inlineTags = new Set([
    "SPAN",
    "A",
    "STRONG",
    "B",
    "EM",
    "I",
    "CODE",
    "BR",
    "SMALL",
    "SUB",
    "SUP",
  ]);
  const allChildrenAreInline = children.every((child) =>
    inlineTags.has(child.tagName.toUpperCase()),
  );

  return allChildrenAreInline;
}

/**
 * Extracts all text items from the resume preview paper with their positions,
 * font sizes, weights, and ATS semantic section categories.
 */
export function extractDomTextItems(
  container: HTMLElement,
  pxPerMm: number,
): AtsTextItem[] {
  const items: AtsTextItem[] = [];
  const containerRect = container.getBoundingClientRect();

  const ignoredTags = new Set([
    "SCRIPT",
    "STYLE",
    "SVG",
    "CANVAS",
    "BUTTON",
    "IMG",
  ]);

  function traverse(node: HTMLElement) {
    const tagName = node.tagName.toUpperCase();
    if (ignoredTags.has(tagName)) return;
    if (node.getAttribute("data-element") === "qr-code") return;
    if (node.getAttribute("aria-hidden") === "true") return;

    if (typeof window !== "undefined") {
      const style = window.getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") return;
      if (parseFloat(style.opacity || "1") === 0) return;
    }

    if (isLeafTextElement(node)) {
      const rawText = node.textContent?.trim() || "";
      if (rawText.length > 0) {
        const rect = node.getBoundingClientRect();
        const style =
          typeof window !== "undefined" ? window.getComputedStyle(node) : null;

        const relX = rect.left - containerRect.left;
        const relY = rect.top - containerRect.top;

        const x = pxPerMm > 0 ? relX / pxPerMm : 0;
        const y = pxPerMm > 0 ? relY / pxPerMm : 0;
        const width = pxPerMm > 0 ? rect.width / pxPerMm : 0;
        const height = pxPerMm > 0 ? rect.height / pxPerMm : 0;

        const fontSizePx = style ? parseFloat(style.fontSize || "12") : 12;
        const fontSizePt = fontSizePx * 0.75;

        const fontWeightNum = style
          ? parseInt(style.fontWeight || "400", 10)
          : 400;
        const isBold =
          fontWeightNum >= 600 ||
          style?.fontWeight === "bold" ||
          tagName.startsWith("H");
        const isItalic = style?.fontStyle === "italic";

        let fontFamily: "helvetica" | "times" | "courier" = "helvetica";
        const fontName = (style?.fontFamily || "").toLowerCase();
        if (
          fontName.includes("times") ||
          fontName.includes("serif") ||
          fontName.includes("georgia")
        ) {
          fontFamily = "times";
        } else if (
          fontName.includes("mono") ||
          fontName.includes("courier") ||
          fontName.includes("code")
        ) {
          fontFamily = "courier";
        }

        const category = getElementCategory(node, container);

        items.push({
          text: rawText,
          x,
          y,
          width: Math.max(width, 10),
          height: Math.max(height, 4),
          fontSizePt: Math.max(fontSizePt, 6),
          fontFamily,
          fontWeight: isBold ? "bold" : "normal",
          fontStyle: isItalic ? "italic" : "normal",
          category,
        });

        // Do not traverse children of a leaf text element
        return;
      }
    }

    // Traverse children
    for (const child of Array.from(node.children)) {
      if (child instanceof HTMLElement) {
        traverse(child);
      }
    }
  }

  traverse(container);
  return items;
}

/**
 * Fallback generator for test/headless environments (like JSDOM) where
 * getBoundingClientRect() returns 0. Generates structured ATS text items
 * directly from ResumeData.
 */
export function generateAtsItemsFromData(data: ResumeData): AtsTextItem[] {
  const items: AtsTextItem[] = [];
  let y = 15;
  const x = 15;
  const width = 180;

  // 1. Personal Info
  if (data.personalInfo.fullName) {
    items.push({
      text: data.personalInfo.fullName,
      x,
      y,
      width,
      height: 8,
      fontSizePt: 20,
      fontFamily: "helvetica",
      fontWeight: "bold",
      fontStyle: "normal",
      category: "HEADER",
    });
    y += 10;
  }

  if (data.personalInfo.jobTitle) {
    items.push({
      text: data.personalInfo.jobTitle,
      x,
      y,
      width,
      height: 6,
      fontSizePt: 14,
      fontFamily: "helvetica",
      fontWeight: "bold",
      fontStyle: "normal",
      category: "HEADER",
    });
    y += 8;
  }

  const contacts = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.github,
    data.personalInfo.website,
  ].filter(Boolean);

  if (contacts.length > 0) {
    items.push({
      text: contacts.join(" | "),
      x,
      y,
      width,
      height: 5,
      fontSizePt: 10,
      fontFamily: "helvetica",
      fontWeight: "normal",
      fontStyle: "normal",
      category: "HEADER",
    });
    y += 8;
  }

  // 2. Summary
  if (data.summary) {
    items.push({
      text: "PROFESSIONAL SUMMARY",
      x,
      y,
      width,
      height: 6,
      fontSizePt: 12,
      fontFamily: "helvetica",
      fontWeight: "bold",
      fontStyle: "normal",
      category: "SUMMARY",
    });
    y += 6;
    items.push({
      text: data.summary,
      x,
      y,
      width,
      height: 10,
      fontSizePt: 10,
      fontFamily: "helvetica",
      fontWeight: "normal",
      fontStyle: "normal",
      category: "SUMMARY",
    });
    y += 12;
  }

  // 3. Skills
  if (data.skills && data.skills.length > 0) {
    items.push({
      text: "SKILLS",
      x,
      y,
      width,
      height: 6,
      fontSizePt: 12,
      fontFamily: "helvetica",
      fontWeight: "bold",
      fontStyle: "normal",
      category: "SKILLS",
    });
    y += 6;
    const skillNames = data.skills.map((s) => s.name).join(", ");
    items.push({
      text: skillNames,
      x,
      y,
      width,
      height: 8,
      fontSizePt: 10,
      fontFamily: "helvetica",
      fontWeight: "normal",
      fontStyle: "normal",
      category: "SKILLS",
    });
    y += 10;
  }

  // 4. Work Experience
  if (data.experience && data.experience.length > 0) {
    items.push({
      text: "WORK EXPERIENCE",
      x,
      y,
      width,
      height: 6,
      fontSizePt: 12,
      fontFamily: "helvetica",
      fontWeight: "bold",
      fontStyle: "normal",
      category: "EXPERIENCE",
    });
    y += 6;

    for (const exp of data.experience) {
      items.push({
        text: `${exp.jobTitle} - ${exp.company}${exp.location ? `, ${exp.location}` : ""}`,
        x,
        y,
        width,
        height: 5,
        fontSizePt: 11,
        fontFamily: "helvetica",
        fontWeight: "bold",
        fontStyle: "normal",
        category: "EXPERIENCE",
      });
      y += 5;

      const dateStr = `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`;
      items.push({
        text: dateStr,
        x,
        y,
        width,
        height: 4,
        fontSizePt: 9,
        fontFamily: "helvetica",
        fontWeight: "normal",
        fontStyle: "italic",
        category: "EXPERIENCE",
      });
      y += 5;

      if (exp.description) {
        items.push({
          text: exp.description,
          x,
          y,
          width,
          height: 8,
          fontSizePt: 9.5,
          fontFamily: "helvetica",
          fontWeight: "normal",
          fontStyle: "normal",
          category: "EXPERIENCE",
        });
        y += 8;
      }
    }
  }

  // 5. Projects
  if (data.projects && data.projects.length > 0) {
    items.push({
      text: "PROJECTS",
      x,
      y,
      width,
      height: 6,
      fontSizePt: 12,
      fontFamily: "helvetica",
      fontWeight: "bold",
      fontStyle: "normal",
      category: "PROJECTS",
    });
    y += 6;

    for (const proj of data.projects) {
      items.push({
        text: proj.name,
        x,
        y,
        width,
        height: 5,
        fontSizePt: 11,
        fontFamily: "helvetica",
        fontWeight: "bold",
        fontStyle: "normal",
        category: "PROJECTS",
      });
      y += 5;

      if (proj.technologies) {
        items.push({
          text: `Technologies: ${proj.technologies}`,
          x,
          y,
          width,
          height: 4,
          fontSizePt: 9,
          fontFamily: "helvetica",
          fontWeight: "normal",
          fontStyle: "italic",
          category: "PROJECTS",
        });
        y += 5;
      }

      if (proj.description) {
        items.push({
          text: proj.description,
          x,
          y,
          width,
          height: 8,
          fontSizePt: 9.5,
          fontFamily: "helvetica",
          fontWeight: "normal",
          fontStyle: "normal",
          category: "PROJECTS",
        });
        y += 8;
      }
    }
  }

  // 6. Education
  if (data.education && data.education.length > 0) {
    items.push({
      text: "EDUCATION",
      x,
      y,
      width,
      height: 6,
      fontSizePt: 12,
      fontFamily: "helvetica",
      fontWeight: "bold",
      fontStyle: "normal",
      category: "EDUCATION",
    });
    y += 6;

    for (const edu of data.education) {
      items.push({
        text: `${edu.degree} - ${edu.institution}${edu.location ? `, ${edu.location}` : ""}`,
        x,
        y,
        width,
        height: 5,
        fontSizePt: 11,
        fontFamily: "helvetica",
        fontWeight: "bold",
        fontStyle: "normal",
        category: "EDUCATION",
      });
      y += 5;

      const dateStr = `${edu.startDate} - ${edu.endDate}`;
      items.push({
        text: dateStr,
        x,
        y,
        width,
        height: 4,
        fontSizePt: 9,
        fontFamily: "helvetica",
        fontWeight: "normal",
        fontStyle: "italic",
        category: "EDUCATION",
      });
      y += 6;
    }
  }

  // 7. Certifications
  if (data.certifications && data.certifications.length > 0) {
    items.push({
      text: "CERTIFICATIONS",
      x,
      y,
      width,
      height: 6,
      fontSizePt: 12,
      fontFamily: "helvetica",
      fontWeight: "bold",
      fontStyle: "normal",
      category: "CERTIFICATIONS",
    });
    y += 6;

    for (const cert of data.certifications) {
      items.push({
        text: `${cert.name} - ${cert.organization} (${cert.issueDate})`,
        x,
        y,
        width,
        height: 5,
        fontSizePt: 10,
        fontFamily: "helvetica",
        fontWeight: "normal",
        fontStyle: "normal",
        category: "CERTIFICATIONS",
      });
      y += 6;
    }
  }

  // 8. Achievements
  if (data.achievements && data.achievements.length > 0) {
    items.push({
      text: "ACHIEVEMENTS",
      x,
      y,
      width,
      height: 6,
      fontSizePt: 12,
      fontFamily: "helvetica",
      fontWeight: "bold",
      fontStyle: "normal",
      category: "ACHIEVEMENTS",
    });
    y += 6;

    for (const ach of data.achievements) {
      items.push({
        text: `${ach.title} - ${ach.description}`,
        x,
        y,
        width,
        height: 5,
        fontSizePt: 10,
        fontFamily: "helvetica",
        fontWeight: "normal",
        fontStyle: "normal",
        category: "ACHIEVEMENTS",
      });
      y += 6;
    }
  }

  // 9. Languages
  if (data.languages && data.languages.length > 0) {
    items.push({
      text: "LANGUAGES",
      x,
      y,
      width,
      height: 6,
      fontSizePt: 12,
      fontFamily: "helvetica",
      fontWeight: "bold",
      fontStyle: "normal",
      category: "LANGUAGES",
    });
    y += 6;

    const langStr = data.languages
      .map((l) => `${l.name} (${l.proficiency})`)
      .join(", ");
    items.push({
      text: langStr,
      x,
      y,
      width,
      height: 5,
      fontSizePt: 10,
      fontFamily: "helvetica",
      fontWeight: "normal",
      fontStyle: "normal",
      category: "LANGUAGES",
    });
  }

  return items;
}

/**
 * Sorts items according to ATS reading order:
 * Primary: Category priority (HEADER -> SUMMARY -> SKILLS -> EXPERIENCE -> PROJECTS -> EDUCATION ...)
 * Secondary: Vertical position (y) with small line tolerance
 * Tertiary: Horizontal position (x)
 */
export function sortItemsByAtsOrder(items: AtsTextItem[]): AtsTextItem[] {
  return [...items].sort((a, b) => {
    const pA = CATEGORY_PRIORITY[a.category] ?? 99;
    const pB = CATEGORY_PRIORITY[b.category] ?? 99;
    if (pA !== pB) return pA - pB;

    // Within same category: top-to-bottom
    const yDiff = a.y - b.y;
    if (Math.abs(yDiff) > 2) {
      return yDiff;
    }
    // Same line: left-to-right
    return a.x - b.x;
  });
}
