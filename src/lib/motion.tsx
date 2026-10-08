"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ScrollTrigger } from "./gsap";

/**
 * Motion is opt-in: the page renders in its final state for crawlers, for reduced-motion users
 * and before hydration. An inline script in the root layout adds the `motion` class to <html>
 * before first paint (hiding `.gs-hide` elements until their intro runs); this component confirms
 * GSAP is alive, exposes the flag to components and keeps ScrollTrigger measurements fresh.
 */
const MotionContext = createContext(false);

export function MotionRoot({ children }: { children: React.ReactNode }) {
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      const on = !mq.matches;
      html.classList.toggle("motion", on);
      html.dataset.gsap = "1";
      setMotion(on);
    };
    apply();
    mq.addEventListener("change", apply);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      mq.removeEventListener("change", apply);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return <MotionContext.Provider value={motion}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  return useContext(MotionContext);
}
