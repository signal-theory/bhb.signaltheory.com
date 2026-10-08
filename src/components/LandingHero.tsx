"use client";
import Link from "next/link";
import { useId, useRef } from "react";
import { LANDING_PATH_D, LANDING_ROUTE_D } from "./landing-path-data";
import type { SiteContent } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { prepDraw, tweenDraw, tweenTrim } from "@/lib/draw";
import { useMotion } from "@/lib/motion";
import { useFitText } from "@/lib/fit-text";

/** Waypoint dots in the path's 1037 x 1023 coordinate space (five inside the Figma layer, two beside it). */
const DOTS = [
  { x: 62.9, y: 117.5 },
  { x: 595.0, y: 73.3 },
  { x: 1025.1, y: 187.0 },
  { x: 103.7, y: 502.3 },
  { x: 22.5, y: 794.1 },
  { x: 196.6, y: 950.2 },
  { x: 926.7, y: 960.4 },
];

/** Stickers pop when the line reaches the nearest point to them (fractions of the path length). */
const STICKER_AT: Record<string, { x: number; y: number }> = {
  ballot: { x: 62.9, y: 117.5 },
  voted: { x: 1025.1, y: 187.0 },
  vote: { x: 22.5, y: 794.1 },
  box: { x: 926.7, y: 960.4 },
};

const DRAW_SECONDS = 3.2;

export function LandingHero({ home }: { home: SiteContent["home"] }) {
  const root = useRef<HTMLElement>(null);
  const h1 = useRef<HTMLSpanElement>(null);
  const motion = useMotion();
  const maskId = useId();
  useFitText(h1, [home.headline]);

  useGSAP(
    (_, contextSafe) => {
      if (!motion || !root.current || !contextSafe) return;
      const el = root.current;
      // The visible line is the designer's dashes; what we draw is the continuous route in the mask.
      const path = el.querySelector<SVGPathElement>("[data-reveal]");
      const dots = gsap.utils.toArray<SVGGElement>("[data-dot]", el);
      const stickers = gsap.utils.toArray<HTMLElement>("[data-sticker]", el);
      if (!path) return;

      const [item] = prepDraw([path]);
      const samples = 600;
      const pts = Array.from({ length: samples + 1 }, (_, i) => path.getPointAtLength((item.len * i) / samples));
      const fractionAt = ({ x, y }: { x: number; y: number }) => {
        let best = 0;
        let bestDist = Infinity;
        pts.forEach((p, i) => {
          const dist = (p.x - x) ** 2 + (p.y - y) ** 2;
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        return best / samples;
      };

      gsap.set(dots, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(stickers, { autoAlpha: 0, scale: 0.5, rotation: (i: number) => (i % 2 ? 22 : -22) });
      gsap.set("[data-h1]", { autoAlpha: 0, y: 50 });
      gsap.set("[data-cta]", { autoAlpha: 0, y: 24 });

      // 1. On load the baton line runs its lap, dots and stickers landing as it passes them.
      const intro = gsap.timeline();
      intro.add(tweenDraw([item], 0, 1, { duration: DRAW_SECONDS, ease: "power1.inOut" }), 0);
      dots.forEach((d) => {
        const at = fractionAt({ x: Number(d.dataset.cx), y: Number(d.dataset.cy) });
        intro.to(d, { scale: 1, duration: 0.35, ease: "back.out(2.5)" }, Math.max(0, at * DRAW_SECONDS - 0.05));
      });
      stickers.forEach((s) => {
        const key = s.dataset.sticker ?? "";
        const at = STICKER_AT[key] ? fractionAt(STICKER_AT[key]) : 0.5;
        intro.to(s, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.7)" }, at * DRAW_SECONDS);
      });
      intro
        .to("[data-h1]", { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.9)
        .to("[data-cta]", { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.12 }, 1.5);

      // 2. Once the lap is done, scrolling runs the line off the way it came and drifts the stickers.
      intro.eventCallback(
        "onComplete",
        contextSafe(() => {
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: "top+=80 top", end: "bottom 25%", scrub: 0.8 } })
            .add(tweenTrim([item], { ease: "none", duration: 1 }), 0)
            .to(dots, { scale: 0, duration: 0.15, stagger: 0.12, ease: "power2.in" }, 0.05)
            .to("[data-h1]", { y: -40, ease: "none" }, 0)
            .to(stickers, { y: (i: number) => -30 - i * 15, ease: "none" }, 0);
        }),
      );
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section ref={root} className="relative isolate min-h-[100svh] overflow-hidden bg-blue-dark md:h-[75.07vw] md:max-h-[1081px] md:min-h-0">
      {/* Dashed baton line and its waypoints */}
      <svg aria-hidden className="pointer-events-none absolute top-[2.78%] left-[11.25%] w-[72.04%] overflow-visible" viewBox="0 0 1037.31 1023">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-100" y="-100" width="1300" height="1300">
            <path data-reveal d={LANDING_ROUTE_D} fill="none" stroke="#fff" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
          </mask>
        </defs>
        <path d={LANDING_PATH_D} mask={`url(#${maskId})`} className="fill-none stroke-blue-light" strokeWidth={4.53} strokeLinecap="round" strokeLinejoin="round" />
        {DOTS.map((d) => (
          <g key={`${d.x}-${d.y}`} data-dot data-cx={d.x} data-cy={d.y}>
            <circle cx={d.x} cy={d.y} r={9.98} fill="#2d524a" className="stroke-blue-light" strokeWidth={4.53} />
            <circle cx={d.x} cy={d.y} r={3.37} className="fill-blue-light" />
          </g>
        ))}
      </svg>

      <img data-sticker="ballot" src="/graphics/icon-ballot-blue.svg" alt="" width={130.2} height={227.62} className="gs-hide absolute top-[5.55%] left-[7.22%] w-[clamp(56px,9.04vw,130px)]" />
      <img data-sticker="voted" src="/graphics/sticker-we-voted-lg.svg" alt="We voted" width={321} height={321} className="gs-hide absolute top-[4.81%] left-[74.58%] w-[clamp(120px,22.3vw,321px)]" />
      <img data-sticker="vote" src="/graphics/sticker-vote-tilted.svg" alt="Vote" width={179.25} height={209.98} className="gs-hide absolute top-[71.05%] left-[5.35%] w-[clamp(72px,12.45vw,179px)]" />
      <img data-sticker="box" src="/graphics/icon-ballot-box-blue.svg" alt="" width={175.42} height={163.08} className="gs-hide absolute top-[79.56%] left-[75.35%] w-[clamp(80px,12.2vw,175px)]" />

      <div className="absolute inset-x-0 top-[35.15%] flex flex-col items-center px-4 text-center">
        <h1 className="t-display w-full leading-[1.2] text-cream">
          <span ref={h1} data-h1 className="gs-hide block whitespace-nowrap" style={{ fontSize: "clamp(64px, 20.56vw, 296px)" }}>
            {home.headline.pre} <span className="text-blue-light">{home.headline.accent}</span> {home.headline.post}
          </span>
        </h1>
        <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-[28px]">
          {home.buttons.map((b) => (
            <li key={b.href} data-cta className="gs-hide">
              <Link href={b.href} className="btn-solid t-button min-h-[58px]">
                {b.label}
                <img src="/graphics/icon-contact-arrow.svg" alt="" width={34} height={34} />
              </Link>
            </li>
          ))}
        </ul>
        <p data-cta className="gs-hide t-body-sm mt-[28px] flex items-center gap-[5px] text-cream">
          <span>
            {home.note}{" "}
            <a href={home.noteHref} target="_blank" rel="noopener noreferrer" className="text-blue-light underline-offset-4 hover:underline">
              {home.noteLink}
            </a>
          </span>
          <img src="/graphics/icon-arrow-up.svg" alt="" width={19.77} height={20.87} className="rotate-45" />
        </p>
      </div>
    </section>
  );
}
