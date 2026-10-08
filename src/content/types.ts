export type Href = string;

export type NavItem = { label: string; href: Href };

export type RegistrationLink = {
  label: string;
  href: Href;
  icon: "check-registration" | "paper-registration" | "register-online";
};

export type DateCard = {
  /** Red tag at the top of the card, e.g. "MISSOURI DEADLINE" */
  tag: string;
  /** Big date text, e.g. "OCTOBER 7" */
  date: string;
  /** Label under the card, e.g. "Last day to register to vote" */
  label: string;
  /** ISO date for the day, used for ordering and schema */
  iso: string;
};

export type FaqItem = { q: string; a: string };

export type StateContent = {
  slug: "missouri" | "kansas" | "texas";
  name: string;
  abbr: string;
  headline: { line1: string; line2: string };
  /** Poll closing time on election day, with the state's UTC offset */
  electionDay: string;
  electionDayLabel: string;
  registration: {
    heading: string;
    headingAccent: string;
    links: RegistrationLink[];
  };
  dates: { heading: string; headingAccent: string; sub: string; cards: DateCard[] };
  faq: FaqItem[];
  resources: {
    sosName: string;
    sosUrl: Href;
    phone: string;
    email: string;
    pollingPlace: Href;
    sampleBallot: Href;
    voterId: Href;
    absentee: Href;
  };
};

export type ChecklistGroup = { id: string; title: string; items: { id: string; label: string }[] };

export type SiteContent = {
  name: string;
  shortName: string;
  url: string;
  description: string;
  /** Adobe Fonts web project id (use.typekit.net/<id>.css); env NEXT_PUBLIC_ADOBE_FONTS_KIT overrides it */
  adobeFontsKit?: string;
  home: {
    headline: { pre: string; accent: string; post: string };
    buttons: NavItem[];
    note: string;
    noteLink: string;
    noteHref: Href;
    worksHeading: string;
    worksBody: string;
    cardLabel: string;
  };
  nav: NavItem[];
  countdown: { heading: string };
  checklist: { heading: string; headingAccent: string; sub: string; download: string; share: string; pdf: string };
  footer: {
    contactLabel: string;
    contactHref: Href;
    instagram: Href;
    facebook: Href;
    instagramHandle: string;
    facebookHandle: string;
    copyright: string;
  };
};
