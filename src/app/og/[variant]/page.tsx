import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getState, site, stateSlugs } from "@/content";

/**
 * Social share artwork (1200 x 630). `npm run og:images` screenshots these pages with headless
 * Chrome into public/og-images/<variant>.png so the cards use the real fonts and stickers.
 */
export const instant = false;

export const metadata: Metadata = { title: "Share image", robots: { index: false, follow: false } };

export function generateStaticParams() {
  return ["home", ...stateSlugs].map((variant) => ({ variant }));
}

const W = 1200;
const H = 630;
const ring = (cx: number, cy: number) =>
  Array.from({ length: 9 }, (_, k) => <circle key={k} cx={cx} cy={cy} r={430 - 34 * k} />);

export default async function ShareImage({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  const state = variant === "home" ? null : getState(variant);
  if (variant !== "home" && !state) notFound();

  return (
    <>
      {/* Hide the Next.js dev badge so it never lands in a screenshot */}
      <style>{`nextjs-portal{display:none!important} html,body{overflow:hidden}`}</style>
      <main className="relative overflow-hidden bg-blue-dark" style={{ width: W, height: H }}>
        <svg aria-hidden className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <g className="fill-none stroke-blue-light" strokeWidth={3}>
            {ring(1250, -90)}
            {ring(-60, 730)}
          </g>
        </svg>

        <img src="/graphics/sticker-we-voted-lg.svg" alt="" width={321} height={321} className="absolute top-[34px] right-[54px] w-[190px]" />
        <img src="/graphics/sticker-vote-tilted.svg" alt="" width={179} height={210} className="absolute bottom-[40px] left-[66px] w-[132px]" />
        <img src="/graphics/icon-ballot-blue.svg" alt="" width={130} height={228} className="absolute top-[46px] left-[78px] w-[62px]" />
        <img src="/graphics/icon-ballot-box-blue.svg" alt="" width={175} height={163} className="absolute right-[96px] bottom-[52px] w-[118px]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {state ? (
            <h1 className="t-display flex flex-col items-center leading-[0.85]">
              <span className="text-[230px] text-blue-light">{state.headline.line1}</span>
              <span className="text-[140px] text-cream">{state.headline.line2}</span>
            </h1>
          ) : (
            <h1 className="t-display text-[236px] leading-[0.9] text-cream">
              {site.home.headline.pre} <span className="text-blue-light">{site.home.headline.accent}</span> {site.home.headline.post}
            </h1>
          )}
          <p className="t-label mt-5 text-[22px] tracking-[3px] text-cream">
            {state ? `Voting in ${state.name} · ${state.electionDayLabel}` : "Election info for Missouri, Kansas & Texas"}
          </p>
          <span className="btn-solid t-button mt-7 min-h-0 px-6 py-3 text-[22px]">
            {new URL(site.url).host}
            {state ? `/${state.slug}` : ""}
          </span>
        </div>
      </main>
    </>
  );
}
