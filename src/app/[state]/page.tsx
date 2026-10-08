import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Registration } from "@/components/Registration";
import { Dates } from "@/components/Dates";
import { Faq } from "@/components/Faq";
import { Countdown } from "@/components/Countdown";
import { Checklist } from "@/components/Checklist";
import { Footer } from "@/components/Footer";
import { checklist, getState, site, stateSlugs } from "@/content";

type Params = { params: Promise<{ state: string }> };

/**
 * All three state pages are prerendered from generateStaticParams, and the whole page depends on
 * the state param, so let navigation wait for the prerendered page instead of showing a shell.
 */
export const instant = false;

export function generateStaticParams() {
  return stateSlugs.map((state) => ({ state }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { state } = await params;
  const data = getState(state);
  if (!data) return {};
  return {
    title: `Voting in ${data.name}`,
    description: `How to register, key deadlines, FAQs and a plan-to-vote checklist for the ${data.electionDayLabel} election in ${data.name}.`,
  };
}

export default async function StatePage({ params }: Params) {
  const { state } = await params;
  const data = getState(state);
  if (!data) notFound();
  return (
    <main>
      <Hero headline={data.headline} />
      <Nav items={site.nav} current={`/${data.slug}`} />
      <Registration state={data} />
      <Dates state={data} />
      <Faq items={data.faq} />
      <Countdown target={data.electionDay} heading={site.countdown.heading} electionDayLabel={data.electionDayLabel} />
      <Checklist groups={checklist} copy={site.checklist} />
      <Footer footer={site.footer} />
    </main>
  );
}
