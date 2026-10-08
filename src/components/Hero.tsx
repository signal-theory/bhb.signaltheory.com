"use client";
import { useRef } from "react";
import { Lanes } from "./Lanes";
import { gsap, useGSAP } from "@/lib/gsap";
import { prepDraw, tweenDraw, tweenTrim } from "@/lib/draw";
import { useMotion } from "@/lib/motion";
import { useFitText } from "@/lib/fit-text";

const W = 1440;
const H = 1231;

/**
 * The hero track from the Figma file: two sets of nine track "pills" whose rounded ends show in the
 * top-right and bottom-left corners. The ends are concentric ellipses (the pills were scaled
 * non-uniformly), so each visible arc is computed from the ellipse that enters and leaves the frame.
 */
const RINGS = Array.from({ length: 9 }, (_, k) => ({ rx: 581.46 - 34.88 * k, ry: 657.57 - 39.45 * k }));
const RIGHT = { cx: 1523.18, cy: -209.85 }; // enters at the top edge, leaves at the right edge
const LEFT = { cx: -198.32, cy: 1338.67 }; // enters at the left edge, leaves at the bottom edge
const f = (n: number) => n.toFixed(2);

const RIGHT_ARCS = RINGS.map(({ rx, ry }) => {
  const xTop = RIGHT.cx - rx * Math.sqrt(1 - (RIGHT.cy / ry) ** 2);
  const yRight = RIGHT.cy + ry * Math.sqrt(1 - ((W - RIGHT.cx) / rx) ** 2);
  return `M ${f(xTop)} 0 A ${f(rx)} ${f(ry)} 0 0 0 ${W} ${f(yRight)}`;
});
const LEFT_ARCS = RINGS.map(({ rx, ry }) => {
  const yLeft = LEFT.cy - ry * Math.sqrt(1 - (LEFT.cx / rx) ** 2);
  const xBottom = LEFT.cx + rx * Math.sqrt(1 - ((H - LEFT.cy) / ry) ** 2);
  return `M 0 ${f(yLeft)} A ${f(rx)} ${f(ry)} 0 0 1 ${f(xBottom)} ${H}`;
});

/** Rotation of the "VOTE" sticker in the design (its 212 x 248 art sits in a 325 x 326 frame). */
const VOTE_ROTATION = 43.5;

export function Hero({ headline }: { headline: { line1: string; line2: string } }) {
  const root = useRef<HTMLElement>(null);
  const line1 = useRef<HTMLSpanElement>(null);
  const line2 = useRef<HTMLSpanElement>(null);
  const motion = useMotion();
  useFitText(line1, [headline.line1]);
  useFitText(line2, [headline.line2]);

  useGSAP(
    (_, contextSafe) => {
      if (!motion || !root.current || !contextSafe) return;
      const el = root.current;
      const right = prepDraw(gsap.utils.toArray<SVGPathElement>("[data-arcs-r] path", el));
      const left = prepDraw(gsap.utils.toArray<SVGPathElement>("[data-arcs-l] path", el));
      const lanes = gsap.utils.toArray<HTMLElement>("[data-lane]", el);

      gsap.set(lanes, { scaleY: 0, transformOrigin: "top center" });
      gsap.set("[data-h1], [data-h2]", { autoAlpha: 0, y: 40 });
      gsap.set("[data-st-left]", { autoAlpha: 0, scale: 0.6, rotation: -18 });
      gsap.set("[data-st-right]", { autoAlpha: 0, scale: 0.6, rotation: 18 });

      // 1. Page load: the arcs rake in, the headline lands, the stickers slap on.
      const intro = gsap.timeline({ defaults: { ease: "power3.inOut" } });
      intro
        .add(tweenDraw(right, 0, 1, { duration: 1.2, stagger: 0.07 }), 0)
        .add(tweenDraw(left, 0, 1, { duration: 1.2, stagger: 0.07 }), 0.15)
        .to("[data-h1]", { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.35)
        .to("[data-h2]", { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.5)
        .to("[data-st-left]", { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.7)" }, 0.8)
        .to("[data-st-right]", { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.7)" }, 0.95);

      // 2. The lanes only appear once the visitor starts scrolling, centre lanes first.
      gsap.to(lanes, {
        scaleY: 1,
        ease: "none",
        stagger: { each: 0.06, from: "center" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom 45%", scrub: 0.6 },
      });

      // 3. After the intro, scrolling rakes the arcs back out the way they came and drifts the headline.
      intro.eventCallback(
        "onComplete",
        contextSafe(() => {
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "center top", scrub: 0.6 } })
            .add(tweenTrim(right, { ease: "none", duration: 1, stagger: { each: 0.05, from: "end" } }), 0)
            .add(tweenTrim(left, { ease: "none", duration: 1, stagger: { each: 0.05, from: "end" } }), 0)
            .to("[data-h1]", { y: -30, ease: "none" }, 0)
            .to("[data-h2]", { y: -15, ease: "none" }, 0);
        }),
      );
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section ref={root} className="relative isolate min-h-[100svh] overflow-hidden bg-blue-dark md:h-[75.07vw] md:max-h-[1081px] md:min-h-0">
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMin slice">
        <g data-arcs-r className="line stroke-blue-light">
          {RIGHT_ARCS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g data-arcs-l className="line stroke-blue-light">
          {LEFT_ARCS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </svg>

      {/* Lanes start just under the headline: the headline is centred, so offset from the middle by half its height */}
      <Lanes className="bottom-0 top-[calc(50%+min(17.85vw,257px))]" />

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <h1 className="t-display flex w-full flex-col items-center gap-[8px] text-center leading-[0.85]">
          <span ref={line1} data-h1 className="gs-hide block whitespace-nowrap text-blue-light" style={{ fontSize: "clamp(84px, 27.78vw, 400px)" }}>
            {headline.line1}
          </span>
          <span ref={line2} data-h2 className="gs-hide block whitespace-nowrap text-cream" style={{ fontSize: "clamp(54px, 17.36vw, 250px)" }}>
            {headline.line2}
          </span>
        </h1>
      </div>

      <img
        data-st-left
        src="/graphics/sticker-we-voted.svg"
        alt=""
        width={293}
        height={293}
        className="gs-hide absolute top-[4.44vw] left-[3.4%] w-[clamp(120px,20.35vw,293px)]"
      />
      <div data-st-right className="gs-hide absolute top-[67.6%] left-[89.25%] w-[clamp(90px,14.7vw,212px)]" style={{ rotate: `${VOTE_ROTATION}deg` }}>
        <img src="/graphics/sticker-vote.svg" alt="" width={211.9} height={248.24} className="w-full" />
      </div>
    </section>
  );
}
