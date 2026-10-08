"use client";
import { useId, useRef } from "react";
import { DateCard } from "./DateCard";
import { DATES_PATH_D, DATES_ROUTE_D } from "./dates-path-data";
import type { StateContent } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { prepDraw, tweenDraw } from "@/lib/draw";
import { useMotion } from "@/lib/motion";

/** Waypoint dots along the baton path, in the path's 1045 x 822 coordinate space. */
const DOTS = [
  { x: 12, y: 12 },
  { x: 334, y: 111 },
  { x: 1033, y: 194 },
  { x: 447, y: 547 },
  { x: 1004, y: 801 },
];

export function Dates({ state }: { state: StateContent }) {
  const root = useRef<HTMLElement>(null);
  const motion = useMotion();
  const maskId = useId();
  const { heading, headingAccent, sub, cards } = state.dates;

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      const el = root.current;
      // The visible line is the designer's dashes; what we draw is the continuous route in the mask.
      const path = el.querySelector<SVGPathElement>("[data-reveal]");
      const dots = gsap.utils.toArray<SVGGElement>("[data-dot]", el);

      // The path is hidden on phones; skip its choreography when it is not rendered.
      if (path && path.ownerSVGElement?.getClientRects().length) {
        const [item] = prepDraw([path]);
        // Where each dot sits along the route, as a fraction of the path length
        const samples = 400;
        const pts = Array.from({ length: samples + 1 }, (_, i) => path.getPointAtLength((item.len * i) / samples));
        const at = dots.map((d) => {
          const cx = Number(d.dataset.cx);
          const cy = Number(d.dataset.cy);
          let best = 0;
          let bestDist = Infinity;
          pts.forEach((p, i) => {
            const dist = (p.x - cx) ** 2 + (p.y - cy) ** 2;
            if (dist < bestDist) {
              bestDist = dist;
              best = i;
            }
          });
          return best / samples;
        });
        gsap.set(dots, { scale: 0, transformOrigin: "50% 50%" });
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 60%", scrub: 0.8 } });
        tl.add(tweenDraw([item], 0, 1, { ease: "none", duration: 1 }), 0);
        dots.forEach((d, i) => tl.to(d, { scale: 1, duration: 0.06, ease: "back.out(2.5)" }, Math.max(0, at[i] - 0.01)));
      }

      gsap.from("[data-date-card]", {
        y: 60,
        rotation: (i: number) => [-8, 6, -5][i % 3],
        autoAlpha: 0,
        duration: 0.9,
        ease: "back.out(1.5)",
        stagger: 0.15,
        scrollTrigger: { trigger: "[data-dates-row]", start: "top 80%", once: true },
      });
      gsap.from("[data-sticker]", {
        scale: 0.4,
        rotation: -40,
        autoAlpha: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.15,
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section id="dates" ref={root} className="relative isolate z-10 bg-red-dark py-[72px] md:py-[138px]">
      <div className="relative mx-auto max-w-(--page-max)">
        <svg aria-hidden className="pointer-events-none absolute top-[-15px] left-[13.75%] hidden w-[72.57%] overflow-visible md:block" viewBox="0 0 1045 822.5">
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="-100" y="-100" width="1300" height="1100">
              <path data-reveal d={DATES_ROUTE_D} fill="none" stroke="#fff" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
            </mask>
          </defs>
          <path d={DATES_PATH_D} mask={`url(#${maskId})`} className="line stroke-red-light" />
          {DOTS.map((d) => (
            <g key={`${d.x}-${d.y}`} data-dot data-cx={d.x} data-cy={d.y}>
              <circle cx={d.x} cy={d.y} r={9.68} className="fill-red-dark stroke-red-light" strokeWidth={4} />
              <circle cx={d.x} cy={d.y} r={3.27} className="fill-red-light" />
            </g>
          ))}
        </svg>

        <img
          data-sticker
          src="/graphics/icon-ballot.svg"
          alt=""
          width={96}
          height={167}
          className="gs-hide absolute top-[-52px] left-[18%] w-[clamp(53px,6.7vw,96px)] rotate-[20.44deg] md:top-[-119px] md:left-[4.8%]"
        />
        <img
          data-sticker
          src="/graphics/badge-star-blue-left.svg"
          alt=""
          width={109.11}
          height={110.2}
          className="gs-hide absolute top-[153px] left-[6.4%] hidden w-[clamp(64px,7.6vw,109px)] rotate-[-54.82deg] md:block"
        />
        <img
          data-sticker
          src="/graphics/badge-star-blue.svg"
          alt=""
          width={109.11}
          height={110.2}
          className="gs-hide absolute top-[-35px] right-[7%] w-[clamp(65px,7.6vw,109px)] md:top-[50px] md:right-[3.5%]"
        />

        <div className="relative flex flex-col items-center gap-[10px] px-(--gutter) text-center">
          <h2 className="t-display t-h1 text-balance text-red-light">
            {heading} <span className="text-cream">{headingAccent}</span>
          </h2>
          <p className="t-body text-cream">{sub}</p>
        </div>

        <ul data-dates-row className="relative mt-10 flex flex-col items-center gap-8 px-(--gutter) md:mt-[117px] md:flex-row md:items-start md:justify-between md:gap-12">
          {cards.map((card) => (
            <li key={card.tag + card.date} data-date-card className="gs-hide flex w-full flex-col items-center gap-4 md:flex-1 md:gap-8">
              <DateCard tag={card.tag} date={card.date} />
              <p className="t-label max-w-[268px] text-center text-cream">{card.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
