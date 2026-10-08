import { LandingHero } from "@/components/LandingHero";
import { HowVotingWorks } from "@/components/HowVotingWorks";
import { Footer } from "@/components/Footer";
import { getStates, site } from "@/content";

export default function HomePage() {
  return (
    <main>
      <LandingHero home={site.home} />
      <HowVotingWorks states={getStates()} copy={site.home} />
      <Footer footer={site.footer} />
    </main>
  );
}
