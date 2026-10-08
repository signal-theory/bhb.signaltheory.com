"use client";
import { useRef } from "react";
import { Lanes } from "./Lanes";
import { gsap, useGSAP } from "@/lib/gsap";
import { prepDraw, tweenDraw } from "@/lib/draw";
import { useMotion } from "@/lib/motion";

/** Diagonal lines fanning out below the card (Figma "Track Bottom"). */
const FAN = [
  "M207.5 -30L0 194.5",
  "M263 -30L100 194.5",
  "M310.5 -30L195.5 194",
  "M364 -30L292 194",
  "M411.5 -30L389 194",
  "M460.5 -30L483.5 194",
  "M508 -30L580 194",
  "M561.5 -30L677.5 194",
  "M609 -30L772.5 194",
  "M666.5 -30L875 194",
];

/**
 * Cream section with the lanes running in from the top, a dark green card in the middle,
 * and the track fanning out below. Used by the registration block and the homepage state cards.
 */
export function TrackShell({ id, children }: { id?: string; children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const motion = useMotion();

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      const lanes = gsap.utils.toArray<HTMLElement>("[data-lane]", root.current);
      gsap.fromTo(
        lanes,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          ease: "none",
          stagger: { each: 0.06, from: "center" },
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 25%", scrub: 0.6 },
        },
      );
      const fan = prepDraw(gsap.utils.toArray<SVGGeometryElement>("[data-fan] path", root.current));
      const fanEl = root.current.querySelector("[data-fan]");
      tweenDraw(fan, 0, 1, {
        ease: "none",
        stagger: { each: 0.06, from: "center" },
        scrollTrigger: { trigger: fanEl, start: "top 90%", end: "bottom 45%", scrub: 0.6 },
      });
      gsap.from("[data-sticker]", {
        scale: 0.4,
        rotation: "-=30",
        autoAlpha: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section
      id={id}
      ref={root}
      className="relative isolate bg-cream pt-(--lane-run) pb-(--fan-h)"
      style={{ "--lane-run": "clamp(110px, 12.9vw, 185.5px)", "--fan-h": "min(186px, 21.26vw)" } as React.CSSProperties}
    >
      {/* Dark green block the lanes run on, merging into the card below */}
      <div aria-hidden className="absolute top-0 left-1/2 h-(--lane-run) w-[calc(8*var(--lane-gap)+4px)] -translate-x-1/2 bg-green-dark" />
      <Lanes className="top-0 h-(--lane-run)" lineClass="bg-green-light" />

      <div className="wrap relative z-10">{children}</div>

      <svg
        data-fan
        aria-hidden
        className="absolute bottom-0 left-1/2 w-[min(875px,100%)] -translate-x-1/2 overflow-visible"
        viewBox="0 0 875 186"
      >
        <path d="M182.5 -1H695.5L867.5 186H10L182.5 -1Z" className="fill-green-dark" />
        <g className="line stroke-green-light">
          {FAN.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </svg>

      <img
        data-sticker
        src="/graphics/badge-star-red.svg"
        alt=""
        width={88}
        height={89}
        className="gs-hide absolute top-[53px] left-[4%] w-[clamp(56px,6.1vw,88px)] rotate-[-75.08deg]"
      />
    </section>
  );
}
