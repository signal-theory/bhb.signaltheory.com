"use client";
import { useRef, useState } from "react";
import type { SiteContent } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { prepDraw, tweenDraw } from "@/lib/draw";
import { useMotion } from "@/lib/motion";

/**
 * Footer track from the Figma file (1440 x 395): the tops of four stacked track pills centred on
 * x = -152.3, plus the straight lanes running off to the right.
 */
const CX = -152.323;
const ARCS = [
  { top: 0, r: 1098.68 },
  { top: 130.795, r: 967.882 },
  { top: 261.59, r: 837.087 },
  { top: 392.385, r: 706.292 },
].map(({ top, r }) => {
  const cy = top + r;
  const dy = 395 - cy;
  const x = CX + Math.sqrt(Math.max(0, r * r - dy * dy));
  return `M ${CX} ${top} A ${r} ${r} 0 0 1 ${x.toFixed(2)} 395`;
});
const LINES = [0, 130.795, 261.59, 392.385].map((y) => `M ${CX} ${y} H 1440`);
const MOBILE_LINES = [7, 55, 103, 151, 199].map((y) => `M -10 ${y} H 400`);

export function Footer({ footer }: { footer: SiteContent["footer"] }) {
  const root = useRef<HTMLElement>(null);
  const motion = useMotion();
  const [copied, setCopied] = useState(false);
  const email = footer.contactHref.replace(/^mailto:/, "").split("?")[0];

  // Many visitors have no mail app wired to mailto links, so a click also copies the address.
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked: the mailto link still runs */
    }
  };

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      const el = root.current;
      const visible = (p: SVGPathElement) => p.getTotalLength() > 0 && !!p.ownerSVGElement?.getClientRects().length;
      const arcs = prepDraw(gsap.utils.toArray<SVGPathElement>("[data-track-arcs] path", el).filter(visible));
      const lines = prepDraw(gsap.utils.toArray<SVGPathElement>("[data-track-lines] path", el).filter(visible));
      const band = el.querySelector("[data-band]");
      gsap
        .timeline({ scrollTrigger: { trigger: band, start: "top 90%", end: "bottom 60%", scrub: 0.6 } })
        .add(tweenDraw(arcs, 0, 1, { ease: "none", duration: 1, stagger: 0.08 }), 0)
        .add(tweenDraw(lines, 0, 1, { ease: "none", duration: 1, stagger: 0.08 }), 0.1);

      gsap.from("[data-vote]", {
        y: 80,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-graphic]", start: "top 80%", once: true },
      });
      gsap.from("[data-sticker]", {
        scale: 0.4,
        rotation: -45,
        autoAlpha: 0,
        duration: 0.9,
        ease: "back.out(1.7)",
        stagger: 0.2,
        scrollTrigger: { trigger: "[data-graphic]", start: "top 70%", once: true },
      });
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <footer ref={root} className="relative isolate bg-blue-dark pb-8 md:pb-[60px]">
      <div data-band className="relative h-[290px] overflow-hidden md:h-[max(395px,27.43vw)]">
        <svg aria-hidden className="absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 1440 395" preserveAspectRatio="xMinYMin slice">
          <g data-track-arcs className="line stroke-blue-light" strokeLinecap="butt">
            {ARCS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <g data-track-lines className="line stroke-blue-light" strokeLinecap="butt">
            {LINES.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </svg>
        {/* Phones (mobile mock): the straight lanes only, 42px apart, the arcs are off-canvas */}
        <svg aria-hidden className="absolute inset-0 h-full w-full md:hidden" viewBox="0 0 390 290" preserveAspectRatio="none">
          <g data-track-lines className="fill-none stroke-blue-light" strokeWidth={1.8}>
            {MOBILE_LINES.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </svg>
        <div className="wrap absolute inset-x-0 top-[127px] flex -translate-y-1/2 items-center justify-between gap-5 md:top-[74.3%] md:translate-y-0 md:justify-end md:gap-[50px]">
          <a
            href={footer.contactHref}
            onClick={copyEmail}
            aria-label={`${footer.contactLabel}: ${email}`}
            className="group btn-solid t-button min-h-[32px] flex-1 justify-between px-3 py-1 text-[11px] tracking-[1px] md:min-h-[69px] md:w-[331px] md:flex-none md:px-4 md:py-3 md:text-[18px] md:tracking-[2px]"
          >
            {/* Label swaps to the address on hover/focus, and to a confirmation after a click copies it */}
            <span className="relative grid min-w-0 flex-1 overflow-hidden text-left">
              <span className={`col-start-1 row-start-1 truncate transition-all duration-300 ${copied ? "-translate-y-full opacity-0" : "group-hover:-translate-y-full group-hover:opacity-0 group-focus-visible:-translate-y-full group-focus-visible:opacity-0"}`}>
                {footer.contactLabel}
              </span>
              <span
                aria-hidden
                className={`col-start-1 row-start-1 truncate tracking-[0.5px] normal-case transition-all duration-300 ${copied ? "translate-y-full opacity-0" : "translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"}`}
              >
                {email}
              </span>
              <span aria-hidden className={`col-start-1 row-start-1 truncate transition-all duration-300 ${copied ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                Email copied!
              </span>
            </span>
            <img src="/graphics/icon-contact-arrow.svg" alt="" width={34} height={34} className="size-4 shrink-0 md:size-[34px]" />
          </a>
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? `${email} copied to clipboard` : ""}
          </span>
          <div className="flex items-center gap-5 md:gap-[50px]">
            <a href={footer.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-transform hover:-translate-y-1">
              <img src="/graphics/icon-instagram.svg" alt="" width={60} height={60} className="size-7 md:size-[60px]" />
            </a>
            <a href={footer.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition-transform hover:-translate-y-1">
              <img src="/graphics/icon-facebook.svg" alt="" width={64} height={64} className="size-7 md:size-[60px]" />
            </a>
          </div>
        </div>
      </div>

      <div data-graphic className="relative mx-auto mt-8 aspect-[1109/591] w-[min(1109px,88%)] md:mt-[27px] md:w-[min(1109px,100%)]">
        <img data-vote src="/graphics/vote-letters.svg" alt="Vote" width={707.19} height={444.6} className="gs-hide absolute top-[16.6%] left-[26%] w-[63.8%]" />
        <div data-sticker className="gs-hide absolute top-0 left-0 flex aspect-square w-[35.8%] items-center justify-center">
          <img src="/graphics/sticker-we-voted-footer.svg" alt="We voted" width={293} height={293} className="w-[73.7%] rotate-[61.38deg]" />
        </div>
        <div data-sticker className="gs-hide absolute top-[67%] right-0 flex aspect-square w-[17.6%] items-center justify-center">
          <img src="/graphics/badge-check-footer.svg" alt="" width={176.93} height={176.93} className="w-[90.6%] rotate-[-6.29deg]" />
        </div>
      </div>

      <div className="wrap mt-8 flex flex-col items-center gap-2 md:mt-[27px] md:flex-row md:justify-between md:gap-4">
        <img src="/graphics/logo-bhb-signal-theory.svg" alt="Babes Helping Babes at Signal Theory" width={305} height={66.58} className="w-[183px] md:w-[305px]" />
        <span className="t-caption text-blue-light">{footer.copyright}</span>
      </div>
    </footer>
  );
}
