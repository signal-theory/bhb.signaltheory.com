"use client";
import { gsap } from "./gsap";

/**
 * Line drawing: set stroke-dasharray to the path length and drive stroke-dashoffset.
 * progress 0 = nothing drawn, 1 = fully drawn, >1 = the line keeps travelling and exits the far end.
 */
export type DrawItem = { el: SVGGeometryElement; len: number };

export function prepDraw(els: Iterable<SVGGeometryElement | null | undefined>, from = 0): DrawItem[] {
  const items: DrawItem[] = [];
  for (const el of els) {
    if (!el) continue;
    const len = el.getTotalLength();
    el.style.strokeDasharray = `${len} ${len}`;
    el.style.strokeDashoffset = `${len * (1 - from)}`;
    items.push({ el, len });
  }
  return items;
}

export function setDraw(items: DrawItem[], progress: number) {
  for (const { el, len } of items) el.style.strokeDashoffset = `${len * (1 - progress)}`;
}

export function tweenDraw(items: DrawItem[], from: number, to: number, vars: gsap.TweenVars = {}) {
  return gsap.fromTo(
    items.map((i) => i.el),
    { strokeDashoffset: (i: number) => items[i].len * (1 - from) },
    { strokeDashoffset: (i: number) => items[i].len * (1 - to), ...vars },
  );
}

/** Draw the line, then keep going so it leaves the way it came in (used when the hero arcs rake away). */
export function tweenTrim(items: DrawItem[], vars: gsap.TweenVars = {}) {
  return gsap.fromTo(
    items.map((i) => i.el),
    { strokeDashoffset: 0 },
    { strokeDashoffset: (i: number) => -items[i].len, ...vars },
  );
}
