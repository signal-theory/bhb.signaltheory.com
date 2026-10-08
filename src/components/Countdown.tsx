"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";

type Remaining = { days: number; hours: number; minutes: number; past: boolean };

function remaining(target: Date): Remaining {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, past: true };
  const minutes = Math.floor(ms / 60000);
  return { days: Math.floor(minutes / 1440), hours: Math.floor(minutes / 60) % 24, minutes: minutes % 60, past: false };
}

type Props = { target: string; heading: string; electionDayLabel: string };

/** Shared timing so each ring's arc and number move together. */
const SWEEP = { duration: 2.4, ease: "power2.out", delay: 0.3, stagger: 0.15 };

export function Countdown({ target, heading, electionDayLabel }: Props) {
  const [t, setT] = useState<Remaining | null>(null);
  const root = useRef<HTMLElement>(null);
  const motion = useMotion();

  useEffect(() => {
    const date = new Date(target);
    const tick = () => setT(remaining(date));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [target]);

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      gsap.from("[data-ring]", {
        scale: 0.7,
        autoAlpha: 0,
        duration: 0.8,
        ease: "back.out(1.6)",
        stagger: 0.15,
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
      // The numbers run down from the full unit (365, 24, 60) to the time left as the rings enter.
      gsap.utils.toArray<HTMLElement>("[data-num]", root.current).forEach((el, i) => {
        const target = Number(el.dataset.value);
        const full = Number(el.dataset.full);
        if (!el.dataset.value || Number.isNaN(target)) return;
        const counter = { v: full };
        gsap.to(counter, {
          v: target,
          duration: SWEEP.duration,
          ease: SWEEP.ease,
          delay: SWEEP.delay + i * SWEEP.stagger,
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v));
          },
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        });
      });
      // Each gauge starts full and shrinks down to the time left, then React keeps it ticking.
      gsap.from("[data-arc]", {
        strokeDashoffset: 0,
        duration: SWEEP.duration,
        ease: SWEEP.ease,
        stagger: SWEEP.stagger,
        delay: SWEEP.delay,
        clearProps: "strokeDashoffset",
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        // Once the sweep is done, let the minute ticks ease instead of jumping.
        onComplete: () => gsap.utils.toArray<SVGCircleElement>("[data-arc]", root.current).forEach((c) => (c.style.transition = "stroke-dashoffset 0.7s ease-out")),
      });
      gsap.from("[data-bubble]", {
        scale: 0.3,
        rotation: 15,
        autoAlpha: 0,
        duration: 0.8,
        ease: "back.out(2)",
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
    },
    { scope: root, dependencies: [motion] },
  );

  const units = [
    { label: "Days", value: t?.days, full: 365, frac: Math.min(1, (t?.days ?? 0) / 365) },
    { label: "Hours", value: t?.hours, full: 24, frac: (t?.hours ?? 0) / 24 },
    { label: "Minutes", value: t?.minutes, full: 60, frac: (t?.minutes ?? 0) / 60 },
  ];

  return (
    <section id="countdown" ref={root} className="relative isolate bg-cream pt-20 pb-[72px] md:py-[100px]">
      <div className="wrap relative">
        <h2 className="t-display t-h1 text-balance text-center text-green-dark">{heading}</h2>
        <img
          data-bubble
          src="/graphics/bubble-lets-go.svg"
          alt="Let's go!"
          width={301}
          height={207}
          className="gs-hide absolute top-[-64px] right-0 w-[clamp(96px,20.9vw,301px)] md:top-[-46px]"
        />
        <ul className="mt-10 flex flex-wrap justify-center gap-1.5 md:mt-[53px] md:gap-[clamp(40px,12.4vw,178px)]" aria-live="polite">
          {units.map((u) => (
            <li key={u.label} data-ring className="gs-hide flex w-[clamp(100px,28.5vw,222px)] flex-col items-center gap-2 md:gap-4">
              <div className="relative aspect-square w-full">
                <svg viewBox="0 0 222 222" className="h-full w-full" aria-hidden>
                  <circle cx="111" cy="111" r="111" className="fill-green-dark" />
                  <circle cx="111" cy="111" r="77" className="fill-cream stroke-green-light" strokeWidth="4" />
                  {/* Gauge: the lit arc is the share of the unit left (days of 365, hours of 24, minutes of 60) */}
                  <circle
                    data-arc
                    cx="111"
                    cy="111"
                    r="77"
                    pathLength="100"
                    className="fill-none stroke-green-light"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="100 100"
                    strokeDashoffset={100 - u.frac * 100}
                    style={{ opacity: u.frac > 0 ? 1 : 0 }}
                  />
                </svg>
                <span
                  data-num
                  data-value={u.value ?? ""}
                  data-full={u.full}
                  className="t-display absolute inset-0 flex items-center justify-center text-green-dark tabular-nums"
                  style={{ fontSize: "clamp(44px, 11.7vw, 80px)" }}
                >
                  {u.value ?? "–"}
                </span>
              </div>
              <span className="t-label text-[clamp(12px,3.1vw,18px)] tracking-[0.1em] text-green-dark">{u.label}</span>
            </li>
          ))}
        </ul>
        <p className="t-body mt-10 text-center text-green-dark">
          {t?.past ? `Polls closed on ${electionDayLabel}. Thanks for running this.` : `Polls close at 7 p.m. on ${electionDayLabel}.`}
        </p>
      </div>
    </section>
  );
}
