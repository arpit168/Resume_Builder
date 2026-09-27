import { describe, it, expect } from "vitest";
import { getUniqueSelector } from "./design";

describe("getUniqueSelector", () => {
  it("should return null if element is the container", () => {
    const el = document.createElement("div");
    el.id = "container";
    expect(getUniqueSelector(el, "container")).toBeNull();
  });

  it("should correctly identify path inside container", () => {
    const container = document.createElement("div");
    container.id = "container";

    const child = document.createElement("div");
    const target = document.createElement("span");

    child.appendChild(target);
    container.appendChild(child);
    document.body.appendChild(container);

    const selector = getUniqueSelector(target, "container");
    expect(selector).toBe("#container > div:nth-child(1) > span:nth-child(1)");

    document.body.removeChild(container);
  });
});
