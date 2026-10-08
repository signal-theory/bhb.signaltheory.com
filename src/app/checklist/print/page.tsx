import type { Metadata } from "next";
import { checklist, site } from "@/content";

export const metadata: Metadata = {
  title: "Checklist (print)",
  robots: { index: false, follow: false },
};

/**
 * Print layout for the checklist PDF. `npm run checklist:pdf` prints this page with headless
 * Chrome so the PDF carries the real fonts from the Adobe Fonts kit and the site's SVG artwork.
 */
export default function ChecklistPrintPage() {
  const { footer } = site;
  return (
    <>
      <style>{`
        @page { size: 8.5in 11in; margin: 0; }
        html, body { background: #fff !important; }
        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      `}</style>
      <main className="relative mx-auto h-[11in] w-[8.5in] overflow-hidden bg-white px-[0.65in] pt-[0.7in] pb-[0.6in] text-blue-dark">
        <header>
          <h1 className="t-display text-[76px] leading-[0.88] text-blue-light">
            {site.checklist.heading} <span className="text-blue-dark">{site.checklist.headingAccent}</span>
          </h1>
          <p className="t-label-sm mt-3 text-blue-dark">{site.checklist.sub}</p>
        </header>

        <div className="mt-11 grid grid-cols-[1fr_0.78fr] gap-x-10">
          {checklist.map((group) => (
            <section key={group.id}>
              <h2 className="t-label text-blue-light">{group.title}</h2>
              <ul className="mt-6 flex flex-col gap-[18px]">
                {group.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-[14px]">
                    <img src="/graphics/checkbox-ring.svg" alt="" width={46} height={46} className="size-[40px] shrink-0" />
                    <span className="t-body-sm text-[15px] leading-[1.4] text-blue-dark">{item.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <img src="/graphics/icon-trophy.svg" alt="" width={174} height={235} className="absolute right-[0.65in] bottom-[2.2in] w-[150px]" />

        <footer className="absolute inset-x-[0.65in] bottom-[0.6in] flex items-end justify-between border-t-[3px] border-blue-light pt-5">
          <img src="/graphics/logo-bhb-signal-theory.svg" alt="Babes Helping Babes at Signal Theory" width={305} height={66.58} className="w-[210px]" />
          <ul className="flex flex-col gap-[6px]">
            <li className="flex items-center gap-2">
              <img src="/graphics/icon-instagram.svg" alt="Instagram" width={60} height={60} className="size-[22px]" />
              <span className="t-body-sm text-[13px] font-[800] text-blue-dark">{footer.instagramHandle}</span>
            </li>
            <li className="flex items-center gap-2">
              <img src="/graphics/icon-facebook.svg" alt="Facebook" width={64} height={64} className="size-[22px]" />
              <span className="t-body-sm text-[13px] font-[800] text-blue-dark">{footer.facebookHandle}</span>
            </li>
          </ul>
        </footer>
      </main>
    </>
  );
}
