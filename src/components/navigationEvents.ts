// Leave typing, controls, zooming, and native content scrolling to the browser.
export function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest(
    "input, textarea, select, button, a, summary, [contenteditable]:not([contenteditable='false']), dialog[open], [role='dialog']"
  ));
}

export function canScrollWithinSection(target: EventTarget | null, direction: number) {
  let element = target instanceof Element ? target : null;
  while (element && element !== document.body) {
    if (element instanceof HTMLElement && element.scrollHeight > element.clientHeight + 1 &&
      /(auto|scroll)/.test(window.getComputedStyle(element).overflowY)) {
      const remaining = element.scrollHeight - element.clientHeight - element.scrollTop;
      if (direction > 0 ? remaining > 2 : element.scrollTop > 2) return true;
    }
    element = element.parentElement;
  }
  return false;
}
