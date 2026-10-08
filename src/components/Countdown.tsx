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
    { label: "Days", value: t?.days, frac: Math.min(1, (t?.days ?? 0) / 100) },
    { label: "Hours", value: t?.hours, frac: (t?.hours ?? 0) / 24 },
    { label: "Minutes", value: t?.minutes, frac: (t?.minutes ?? 0) / 60 },
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
        <ul className="mt-10 flex flex-wrap justify-center gap-3 md:mt-[53px] md:gap-[clamp(40px,12.4vw,178px)]" aria-live="polite">
          {units.map((u) => (
            <li key={u.label} data-ring className="gs-hide flex w-[clamp(96px,26.75vw,222px)] flex-col items-center gap-2 md:gap-4">
              <div className="relative aspect-square w-full">
                <svg viewBox="0 0 222 222" className="h-full w-full" aria-hidden>
                  <circle cx="111" cy="111" r="111" className="fill-green-dark" />
                  <circle cx="111" cy="111" r="77" className="fill-cream stroke-green-light" strokeWidth="4" />
                  <circle
                    cx="111"
                    cy="111"
                    r="77"
                    pathLength="100"
                    className="fill-none stroke-green-light transition-[stroke-dasharray] duration-700 ease-out"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.max(0.01, u.frac * 100)} 100`}
                  />
                </svg>
                <span className="t-display absolute inset-0 flex items-center justify-center text-green-dark tabular-nums" style={{ fontSize: "clamp(36px, 9.64vw, 80px)" }}>
                  {u.value ?? "–"}
                </span>
              </div>
              <span className="t-label text-[clamp(9px,2.3vw,18px)] tracking-[0.11em] text-green-dark">{u.label}</span>
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
