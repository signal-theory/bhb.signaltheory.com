"use client";
import { useLayoutEffect, type RefObject } from "react";

/**
 * Squeezes a single-line headline horizontally when the active font is wider than the container.
 * With Dharma Gothic M installed nothing happens; with the free fallback the line still fits.
 */
export function useFitText(ref: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const fit = () => {
      el.style.transform = "";
      const w = el.scrollWidth;
      const max = parent.clientWidth;
      if (w > max && max > 0) {
        el.style.transformOrigin = "center top";
        el.style.transform = `scaleX(${(max / w).toFixed(3)})`;
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    if (document.fonts) document.fonts.ready.then(fit);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
