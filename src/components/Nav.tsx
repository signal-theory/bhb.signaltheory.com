"use client";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import type { NavItem } from "@/content/types";

/**
 * Sticky nav. Phones get the hamburger from the mobile mock with a drop-down list; between 768px
 * and 988px the row scrolls sideways; from 989px up it is the centred row from the desktop design.
 */
export function Nav({ items, current }: { items: NavItem[]; current: string }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const links = (extra: string) =>
    items.map((item) => {
      const active = item.href === current;
      return (
        <li key={item.href} className="shrink-0">
          <Link
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={() => setOpen(false)}
            className={`block font-nav font-bold uppercase whitespace-nowrap text-blue-dark underline-offset-4 hover:underline focus-visible:underline aria-[current=page]:underline ${extra}`}
          >
            {item.label}
          </Link>
        </li>
      );
    });

  return (
    <nav aria-label="Primary" className="sticky top-0 z-40 bg-blue-light shadow-[0_4px_17px_rgba(0,0,0,0.15)]">
      {/* Phones: hamburger */}
      <div className="flex h-[51px] items-center justify-end px-5 md:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-dark"
        >
          <span className={`block h-[3px] w-6 rounded-[2px] bg-blue-dark transition-transform duration-200 ${open ? "translate-y-[8px] rotate-45" : ""}`} />
          <span className={`block h-[3px] w-6 rounded-[2px] bg-blue-dark transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-[3px] w-6 rounded-[2px] bg-blue-dark transition-transform duration-200 ${open ? "-translate-y-[8px] -rotate-45" : ""}`} />
        </button>
      </div>
      <ul
        id={menuId}
        className={`absolute inset-x-0 top-full flex flex-col border-t border-blue-dark/15 bg-blue-light px-5 pt-1 pb-4 shadow-[0_12px_24px_rgba(0,0,0,0.15)] md:hidden ${open ? "" : "hidden"}`}
      >
        {links("py-[14px] text-[16px]")}
      </ul>

      {/* Tablets and up: the row */}
      <ul className="hidden h-(--nav-h) items-center gap-4 overflow-x-auto px-5 [scrollbar-width:none] md:flex [&::-webkit-scrollbar]:hidden min-[989px]:justify-center min-[989px]:gap-8 xl:gap-[54px]">
        {links("p-[10px] text-[14px] min-[989px]:text-[16px]")}
      </ul>
    </nav>
  );
}
