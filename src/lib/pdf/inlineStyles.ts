/**
 * Safely extracts CSS rules from all stylesheets in the document.
 *
 * Skips cross-origin stylesheets (like Chrome extension injected styles or remote fonts)
 * that would otherwise throw a SecurityError when accessing cssRules.
 *
 * This string is passed to html-to-image's fontEmbedCSS property to bypass
 * its internal stylesheet parser, completely avoiding unhandled SecurityErrors.
 */
export function getSafeFontCss(): string {
  let safeCss = "";

  if (typeof document === "undefined") {
    return safeCss;
  }

  for (const stylesheet of Array.from(document.styleSheets)) {
    try {
      const rules = stylesheet.cssRules;
      if (!rules) continue;

      for (const rule of Array.from(rules)) {
        safeCss += rule.cssText + "\n";
      }
    } catch {
      // Cross-origin stylesheet.
      // Skip it safely instead of crashing PDF generation.
      continue;
    }
  }

  return safeCss;
}
