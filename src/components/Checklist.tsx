"use client";
import { useRef, useState } from "react";
import type { ChecklistGroup, SiteContent } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { useChecked, writeChecked } from "@/lib/checklist-store";

export function Checklist({ groups, copy }: { groups: ChecklistGroup[]; copy: SiteContent["checklist"] }) {
  const checked = useChecked();
  const [shared, setShared] = useState<"idle" | "copied" | "failed">("idle");
  const root = useRef<HTMLElement>(null);
  const motion = useMotion();

  const toggle = (id: string) => writeChecked({ ...checked, [id]: !checked[id] });
  const reset = () => writeChecked({});

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const done = groups.reduce((n, g) => n + g.items.filter((i) => checked[i.id]).length, 0);

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#checklist`;
    const data = { title: "Race like you mean it", text: "Make your plan to vote with this checklist.", url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared("copied");
    } catch {
      setShared("failed");
    }
    window.setTimeout(() => setShared("idle"), 2500);
  };

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      gsap.from("[data-check-item]", {
        x: -20,
        autoAlpha: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: "[data-check-groups]", start: "top 80%", once: true },
      });
      gsap.from("[data-divider]", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-check-groups]", start: "top 80%", once: true },
      });
      gsap.from("[data-trophy]", {
        scale: 0.4,
        rotation: -15,
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: "back.out(1.8)",
        scrollTrigger: { trigger: "[data-trophy]", start: "top 90%", once: true },
      });
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section id="checklist" ref={root} className="relative isolate bg-blue-dark py-8 md:py-[100px]">
      <div className="wrap">
        <h2 className="t-display t-h1 text-balance text-center text-blue-light">
          {copy.heading} <span className="text-cream">{copy.headingAccent}</span>
        </h2>
        <p className="t-label-sm mt-4 text-center text-cream/80" aria-live="polite">
          {done} of {total} done
          {done > 0 && (
            <>
              {" · "}
              <button type="button" onClick={reset} className="underline underline-offset-4 hover:text-blue-light">
                start over
              </button>
            </>
          )}
        </p>

        <div className="relative mt-10 md:mt-[68px]">
          <div data-check-groups className="flex flex-col gap-[60px] md:flex-row md:items-stretch md:justify-between md:gap-10">
            {groups.map((group, gi) => (
              <div key={group.id} className="contents">
                {gi > 0 && <div data-divider aria-hidden className="hidden w-[4px] shrink-0 rounded-full bg-blue-light md:block" />}
                <div className={gi === 0 ? "md:w-[580px]" : "md:w-[412px]"}>
                  <h3 className="t-label text-blue-light">{group.title}</h3>
                  <ul className="mt-8 flex flex-col gap-5 md:mt-[42px] md:gap-[21px]">
                    {group.items.map((item) => {
                      const on = !!checked[item.id];
                      return (
                        <li key={item.id} data-check-item className="gs-hide">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={on}
                            onClick={() => toggle(item.id)}
                            className="group flex items-center gap-4 text-left focus-visible:outline-none"
                          >
                            <span className="relative block h-[47px] w-[52.5px] shrink-0 rounded-full transition-transform duration-200 group-hover:scale-105 group-focus-visible:ring-3 group-focus-visible:ring-red-light group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-blue-dark">
                              <img src="/graphics/checkbox-ring.svg" alt="" width={46} height={46} className="absolute top-px left-px" />
                              <img
                                src="/graphics/checkbox-checked.svg"
                                alt=""
                                width={44.54}
                                height={31.16}
                                className={`absolute top-[7.92px] left-[7.92px] origin-[35%_50%] transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] ${on ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                              />
                            </span>
                            <span className={`t-body-sm text-cream transition-opacity ${on ? "opacity-70" : ""}`}>{item.label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <img data-trophy src="/graphics/icon-trophy.svg" alt="" width={174} height={235} className="gs-hide absolute right-[7%] bottom-0 hidden w-[174px] md:block" />

          <div className="mt-12 flex flex-col items-center justify-center gap-5 md:mt-[101px] md:flex-row md:flex-wrap md:gap-[21px]">
            <a href={copy.pdf} download className="btn-solid t-button">
              {copy.download}
              <img src="/graphics/icon-download-arrow.svg" alt="" width={34} height={34} className="rotate-90" />
            </a>
            <button type="button" onClick={share} className="btn-outline t-button">
              {shared === "copied" ? "Link copied" : shared === "failed" ? "Copy the URL" : copy.share}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
