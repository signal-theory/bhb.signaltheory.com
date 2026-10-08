"use client";
import Link from "next/link";
import { useRef } from "react";
import { DeadlineSticker } from "./DeadlineSticker";
import type { SiteContent, StateContent } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { prepDraw, tweenDraw } from "@/lib/draw";
import { useMotion } from "@/lib/motion";

/* Card line work, derived from the Figma vectors (card is 434.89 x 326). */
const CARD_W = 434.89;
const CARD_H = 326;
/** Missouri: nine track pills whose rounded right ends are centred on the card's bottom-left corner. */
const MO_ARCS = Array.from({ length: 9 }, (_, k) => {
  const r = 382.4 - 22.94 * k;
  return `M 0 ${(CARD_H - r).toFixed(2)} H 54 A ${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${(54 + r).toFixed(2)} ${CARD_H}`;
});
/** Texas: six stacked pills centred to the right of the card, with their straight lanes running left. */
const TX_RINGS = Array.from({ length: 6 }, (_, k) => 295.59 - 35.19 * k);
const TX_ARCS = TX_RINGS.map((r) => `M 531.3 ${(293.2 - r).toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 0 0 531.3 ${(293.2 + r).toFixed(2)}`);
const TX_LINES = TX_RINGS.map((r) => `M -97.25 ${(293.2 - r).toFixed(2)} H 531.3`);

/** Where each tilted deadline sticker sits in the 1440-wide design, as percentages of the section width. */
const STICKER_POS = [
  { left: "5%", top: "113px", rotate: -40.36 },
  { left: "50%", top: "67px", rotate: -3.18, center: true },
  { left: "75.6%", top: "138px", rotate: 25.32 },
];
const STICKER_ORDER = ["missouri", "texas", "kansas"];

export function HowVotingWorks({ states, copy }: { states: StateContent[]; copy: SiteContent["home"] }) {
  const root = useRef<HTMLElement>(null);
  const motion = useMotion();
  const ordered = STICKER_ORDER.map((slug) => states.find((s) => s.slug === slug)).filter((s): s is StateContent => !!s);

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      const el = root.current;
      gsap.from("[data-deadline]", {
        scale: 0.6,
        rotation: (i: number) => (i % 2 ? 18 : -18),
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        ease: "back.out(1.6)",
        stagger: 0.15,
        scrollTrigger: { trigger: el, start: "top 75%", once: true },
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
      gsap.from("[data-copy]", {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: "[data-copy]", start: "top 85%", once: true },
      });
      gsap.from("[data-card]", {
        y: 60,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: "[data-cards]", start: "top 85%", once: true },
      });
      // Track lines rake into the cards as they scroll into view.
      const lines = prepDraw(gsap.utils.toArray<SVGPathElement>("[data-card-lines] path", el));
      tweenDraw(lines, 0, 1, {
        ease: "none",
        stagger: 0.04,
        scrollTrigger: { trigger: "[data-cards]", start: "top 85%", end: "bottom 60%", scrub: 0.6 },
      });
      gsap.fromTo(
        "[data-card-wipe]",
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", ease: "none", scrollTrigger: { trigger: "[data-cards]", start: "top 85%", end: "bottom 60%", scrub: 0.6 } },
      );
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section id="states" ref={root} className="relative isolate bg-cream pb-[55px]">
      <div className="relative mx-auto max-w-(--page-max)">
        {/* Deadline stickers: scattered on wide screens, a row on small ones */}
        <div className="relative hidden h-[316px] md:block">
          {ordered.map((s, i) => {
            const pos = STICKER_POS[i];
            return (
              <div
                key={s.slug}
                data-deadline
                className="gs-hide absolute"
                style={{ left: pos.left, top: pos.top, transform: pos.center ? "translateX(-50%)" : undefined }}
              >
                <DeadlineSticker tag={s.dates.cards[0].tag} date={s.dates.cards[0].date} style={{ rotate: `${pos.rotate}deg` }} />
              </div>
            );
          })}
          <img data-sticker src="/graphics/badge-star-red.svg" alt="" width={88.27} height={89.14} className="gs-hide absolute top-[158px] left-[29.9%] w-[88px]" />
          <img data-sticker src="/graphics/badge-check.svg" alt="" width={115.64} height={105.82} className="gs-hide absolute top-[60px] left-[63.3%] w-[116px] rotate-[-26.3deg]" />
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-6 px-(--gutter) py-12 md:hidden">
          {ordered.map((s, i) => (
            <li key={s.slug} data-deadline className="gs-hide">
              <DeadlineSticker tag={s.dates.cards[0].tag} date={s.dates.cards[0].date} className="scale-90" style={{ rotate: `${[-8, 3, 7][i]}deg` }} />
            </li>
          ))}
        </ul>

        <div className="px-(--gutter)">
          <div className="mx-auto flex max-w-[739px] flex-col items-center gap-6 text-center">
            <h2 data-copy className="gs-hide t-display text-balance text-blue-dark" style={{ fontSize: "clamp(64px, 10.85vw, 156px)" }}>
              {copy.worksHeading}
            </h2>
            <p data-copy className="gs-hide t-body-sm max-w-[693px] text-black">
              {copy.worksBody}
            </p>
          </div>

          <ul data-cards className="mx-auto mt-[60px] grid max-w-[1355px] gap-6 md:grid-cols-3 md:gap-[25px]">
            {states.map((s) => (
              <li key={s.slug} data-card className="gs-hide">
                <Link
                  href={`/${s.slug}`}
                  className="group relative block h-[240px] overflow-hidden rounded-[13.5px] bg-green-dark transition-transform duration-300 hover:-translate-y-2 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-green-light md:h-[326px]"
                >
                  <CardLines slug={s.slug} />
                  <span className="t-display absolute bottom-[16px] left-[16px] flex flex-col text-[40px] leading-none text-green-light md:text-[52px]">
                    <span>{s.name}</span>
                    <span>{copy.cardLabel}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CardLines({ slug }: { slug: string }) {
  if (slug === "kansas") {
    return (
      <img
        data-card-wipe
        src="/graphics/card-lanes.svg"
        alt=""
        width={719.85}
        height={719.85}
        className="pointer-events-none absolute top-[-328px] left-[-141px] w-[720px] max-w-none -rotate-90"
      />
    );
  }
  const paths = slug === "texas" ? [...TX_ARCS, ...TX_LINES] : MO_ARCS;
  return (
    <svg data-card-lines aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${CARD_W} ${CARD_H}`} preserveAspectRatio="xMinYMin slice">
      <g className="fill-none stroke-green-light" strokeWidth={1}>
        {paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
