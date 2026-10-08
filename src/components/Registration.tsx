"use client";
import { useRef } from "react";
import { TrackShell } from "./TrackShell";
import type { StateContent } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";

const ICONS = {
  "check-registration": { src: "/graphics/icon-check-registration.svg", w: 117.26, h: 93.98 },
  "paper-registration": { src: "/graphics/icon-paper-registration.svg", w: 82.79, h: 104.56 },
  "register-online": { src: "/graphics/icon-register-online.svg", w: 117.26, h: 93.98 },
};

export function Registration({ state }: { state: StateContent }) {
  const card = useRef<HTMLDivElement>(null);
  const motion = useMotion();
  const { heading, headingAccent, links } = state.registration;

  useGSAP(
    () => {
      if (!motion || !card.current) return;
      gsap.from("[data-reg-item]", {
        y: 30,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: card.current, start: "top 70%", once: true },
      });
      gsap.from("[data-badge]", {
        scale: 0.4,
        rotation: -60,
        autoAlpha: 0,
        duration: 0.9,
        ease: "back.out(1.8)",
        scrollTrigger: { trigger: card.current, start: "top 75%", once: true },
      });
    },
    { scope: card, dependencies: [motion] },
  );

  return (
    <TrackShell id="register">
      <div
        ref={card}
        className="relative flex flex-col items-center justify-between gap-10 rounded-[32px] bg-green-dark px-5 py-10 md:min-h-[518px] md:gap-16 md:px-[60px] md:py-[80px]"
      >
        <h2 className="t-display t-h1 text-balance text-center text-green-light">
          {heading} <span className="text-cream">{headingAccent}</span>
        </h2>
        <ul className="flex w-full max-w-[1145px] flex-wrap justify-center gap-x-[10px] gap-y-[38px] md:gap-x-12 md:gap-y-10">
          {links.map((link) => {
            const icon = ICONS[link.icon];
            return (
              <li key={link.label} data-reg-item className="gs-hide w-[150px] md:w-[232px]">
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex flex-col items-center gap-5 text-center focus-visible:outline-3 focus-visible:outline-offset-8 focus-visible:outline-green-light"
                >
                  <span className="flex h-[63px] items-end transition-transform duration-300 group-hover:-translate-y-1 md:h-[105px]">
                    <img src={icon.src} alt="" width={icon.w} height={icon.h} className="h-full w-auto md:h-auto" />
                  </span>
                  <span className="t-label-sm text-[14px] tracking-[0.6px] text-green-light underline-offset-4 group-hover:underline md:text-[16px] md:tracking-[1px]">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <img
          data-badge
          src="/graphics/badge-check.svg"
          alt=""
          width={115.64}
          height={105.82}
          className="gs-hide absolute -top-[52px] -right-[27px] w-[clamp(64px,8vw,116px)] rotate-[-26.3deg] md:-top-[73px] md:-right-[57px]"
        />
      </div>
    </TrackShell>
  );
}
