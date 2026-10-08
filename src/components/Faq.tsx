"use client";
import { useId, useRef, useState } from "react";
import type { FaqItem } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { RichText } from "@/lib/rich-text";

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const root = useRef<HTMLElement>(null);
  const motion = useMotion();
  const baseId = useId();

  useGSAP(
    () => {
      if (!motion || !root.current) return;
      gsap.from("[data-faq-row]", {
        x: -24,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: "[data-faq-list]", start: "top 80%", once: true },
      });
      gsap.from("[data-sticker]", {
        scale: 0.4,
        rotation: -40,
        autoAlpha: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.15,
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
    },
    { scope: root, dependencies: [motion] },
  );

  return (
    <section id="faq" ref={root} className="relative isolate bg-blue-dark py-[60px] md:py-[100px]">
      <div className="wrap relative">
        <img
          data-sticker
          src="/graphics/badge-check-faq.svg"
          alt=""
          width={115.64}
          height={105.82}
          className="gs-hide absolute top-[-10px] left-[6%] w-[58px] rotate-[-26.3deg] md:top-[-77px] md:w-[116px]"
        />
        <img
          data-sticker
          src="/graphics/icon-ballot-box.svg"
          alt=""
          width={154}
          height={143}
          className="gs-hide absolute top-[-35px] right-[10%] w-[77px] md:top-[-87px] md:right-[6%] md:w-[154px]"
        />
        <h2 className="t-display t-h1 text-balance text-center text-blue-light">FAQ</h2>

        <ol data-faq-list className="mx-[18px] mt-6 md:mx-0 md:mt-[30px]">
          {items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-panel-${i}`;
            const buttonId = `${baseId}-button-${i}`;
            const numberCell = isOpen ? "border md:border-4" : `border-r border-b border-l ${i === 0 ? "border-t" : ""}`;
            const questionCell = isOpen ? "border border-l-0 md:border-4 md:border-l-0" : `border-r border-b ${i === 0 ? "border-t" : ""}`;
            return (
              <li key={item.q} data-faq-row className="gs-hide">
                <div className="flex items-stretch">
                  <span
                    aria-hidden
                    className={`t-display flex w-[64px] shrink-0 items-center justify-center border-blue-light text-blue-light md:w-[113px] ${numberCell}`}
                    style={{ fontSize: "clamp(48px, 5.55vw, 80px)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="flex min-w-0 flex-1">
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className={`flex w-full items-center justify-between gap-4 border-blue-light px-3 py-5 text-left transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none md:py-8 ${questionCell}`}
                    >
                      <span className="t-body-bold text-blue-light">{item.q}</span>
                      <img
                        src="/graphics/icon-plus.svg"
                        alt=""
                        width={12.63}
                        height={12.63}
                        className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      />
                    </button>
                  </h3>
                </div>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="grid transition-[grid-template-rows] duration-400 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="flex">
                      <span aria-hidden className="hidden w-[113px] shrink-0 border-b-4 border-l-4 border-blue-light bg-cream md:block" />
                      <div className="t-body flex-1 border-r border-b border-l border-blue-light bg-cream px-5 py-6 text-blue-dark md:border-r-4 md:border-b-4 md:border-l-0 md:px-6 md:py-8 md:pr-[100px]">
                        <RichText text={item.a} />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
