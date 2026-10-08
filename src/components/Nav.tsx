import Link from "next/link";
import type { NavItem } from "@/content/types";

export function Nav({ items, current }: { items: NavItem[]; current: string }) {
  return (
    <nav aria-label="Primary" className="sticky top-0 z-40 bg-blue-light shadow-[0_4px_17px_rgba(0,0,0,0.15)]">
      <ul className="flex h-(--nav-h) items-center gap-4 overflow-x-auto px-5 [scrollbar-width:none] md:justify-center md:gap-[54px] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const active = item.href === current;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="block p-[10px] font-nav text-[14px] font-bold uppercase whitespace-nowrap text-blue-dark underline-offset-4 hover:underline focus-visible:underline aria-[current=page]:underline md:text-[16px]"
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
