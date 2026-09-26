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
