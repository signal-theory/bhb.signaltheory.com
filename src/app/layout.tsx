import type { Metadata, Viewport } from "next";
import { Montserrat, Nunito_Sans, Saira_Extra_Condensed } from "next/font/google";
import "./globals.css";
import { MotionRoot } from "@/lib/motion";
import site from "@/content/site.json";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["700"], variable: "--font-montserrat", display: "swap" });
const saira = Saira_Extra_Condensed({ subsets: ["latin"], weight: ["900"], variable: "--font-saira", display: "swap" });
const nunito = Nunito_Sans({ subsets: ["latin"], weight: ["400", "800"], variable: "--font-nunito", display: "swap" });

/** Optional Adobe Fonts web project that carries Dharma Gothic M (see .env.example). */
const adobeKit = process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT;

/**
 * Runs before first paint so animated elements can start hidden without a flash. If GSAP never
 * reports in (JS failed to load), the class is removed and the page shows its final state.
 */
const MOTION_SCRIPT = `(function(){try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var h=document.documentElement;h.classList.add('motion');setTimeout(function(){if(h.dataset.gsap!=='1')h.classList.remove('motion')},4000)}}catch(e){}})();`;

export const viewport: Viewport = { themeColor: "#1c4b4f" };

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: { title: site.name, description: site.description, type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${saira.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
        {adobeKit && <link rel="stylesheet" href={`https://use.typekit.net/${adobeKit}.css`} />}
        <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />
      </head>
      <body>
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
