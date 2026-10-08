import Link from "next/link";
import { site } from "@/content";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-8 bg-blue-dark px-6 text-center">
      <h1 className="t-display text-[clamp(96px,20vw,250px)] leading-[0.85] text-blue-light">Off track</h1>
      <p className="t-body text-cream">That page isn’t on the course. Pick a lane:</p>
      <ul className="flex flex-wrap justify-center gap-4">
        {site.nav
          .filter((i) => i.href.startsWith("/"))
          .map((i) => (
            <li key={i.href}>
              <Link href={i.href} className="btn-solid t-button">
                {i.label}
              </Link>
            </li>
          ))}
      </ul>
    </main>
  );
}
