"use client";

import { DesignConfig } from "@/types/resume";

export function DesignStyleInjector({ design }: { design?: DesignConfig }) {
  if (!design || !design.elements) return null;

  const generateCSS = () => {
    return Object.entries(design.elements!)
      .map(([selector, styles]) => {
        const rules = [];

        if (styles.x !== undefined || styles.y !== undefined) {
          rules.push(
            `transform: translate(${styles.x || 0}px, ${styles.y || 0}px) !important;`,
          );
        }
        if (styles.width !== undefined) {
          rules.push(
            `width: ${typeof styles.width === "number" ? `${styles.width}px` : styles.width} !important;`,
          );
        }
        if (styles.height !== undefined) {
          rules.push(
            `height: ${typeof styles.height === "number" ? `${styles.height}px` : styles.height} !important;`,
          );
        }
        if (styles.fontFamily) {
          rules.push(`font-family: ${styles.fontFamily} !important;`);
        }
        if (styles.fontSize) {
          rules.push(`font-size: ${styles.fontSize} !important;`);
        }
        if (styles.fontWeight) {
          rules.push(`font-weight: ${styles.fontWeight} !important;`);
        }
        if (styles.fontStyle) {
          rules.push(`font-style: ${styles.fontStyle} !important;`);
        }
        if (styles.textTransform) {
          rules.push(`text-transform: ${styles.textTransform} !important;`);
        }
        if (styles.textAlign) {
          rules.push(`text-align: ${styles.textAlign} !important;`);
        }
        if (styles.letterSpacing) {
          rules.push(`letter-spacing: ${styles.letterSpacing} !important;`);
        }
        if (styles.lineHeight) {
          rules.push(`line-height: ${styles.lineHeight} !important;`);
        }
        if (styles.color) {
          rules.push(`color: ${styles.color} !important;`);
        }
        if (styles.backgroundColor) {
          rules.push(`background-color: ${styles.backgroundColor} !important;`);
        }
        if (styles.padding) {
          rules.push(`padding: ${styles.padding} !important;`);
        }
        if (styles.margin) {
          rules.push(`margin: ${styles.margin} !important;`);
        }
        if (styles.borderRadius) {
          rules.push(`border-radius: ${styles.borderRadius} !important;`);
        }
        if (styles.border) {
          rules.push(`border: ${styles.border} !important;`);
        }
        if (styles.display) {
          rules.push(`display: ${styles.display} !important;`);
        }
        if (styles.flexDirection) {
          rules.push(`flex-direction: ${styles.flexDirection} !important;`);
        }
        if (styles.justifyContent) {
          rules.push(`justify-content: ${styles.justifyContent} !important;`);
        }
        if (styles.alignItems) {
          rules.push(`align-items: ${styles.alignItems} !important;`);
        }

        if (rules.length === 0) return "";
        return `${selector} { ${rules.join(" ")} }`;
      })
      .join("\n");
  };

  const css = generateCSS();

  if (!css) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: css,
      }}
    />
  );
}
