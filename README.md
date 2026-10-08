# BHB Vote

Get-out-the-vote site for Babes Helping Babes, built from the Figma file "BHB Concept" (Homepage Layout - Missouri).
Next.js 16 (App Router), Tailwind CSS 4, GSAP 3 + ScrollTrigger, TypeScript.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks and lints)
npm run checklist:pdf   # prints /checklist/print to public/checklist.pdf (needs the dev server running)
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing page (Figma node 62-42): dashed baton line hero with stickers and register buttons, "How voting works" with the tilted deadline stickers and the three election info cards that link to each state page, footer |
| `/missouri`, `/kansas`, `/texas` | The full designed layout per state: hero, nav, registration links, race dates, FAQ accordion, countdown, checklist, footer |

State pages are generated from `src/content/states/*.json` through `generateStaticParams`, so adding a state is a new JSON file plus a nav entry.

## Content (and the links still to add)

Everything editable lives in `src/content/` as JSON:

- `site.json` – site name, landing page copy (headline, register buttons, vote.gov note, "How voting works"), nav, countdown heading, checklist copy, footer links.
- `checklist.json` – the "Race like you mean it" checklist (ids are stored in localStorage, so keep them stable).
- `states/<state>.json` – headline, election day, registration links, race dates, FAQ, resources.

Links are placeholders (`"#"`) until the official URLs are dropped in. Fields to fill per state:

- `registration.links[].href` – check registration, paper form (English), paper form (Español), register online.
- `resources.*` – Secretary of State site, polling place lookup, sample ballot, voter ID page, absentee page.
- `site.json` → `footer.contactHref`, `footer.instagram`, `footer.facebook`, `url`.

Dates in the JSON are for the November 3, 2026 general election. The Missouri absentee card uses October 21 (the official mail request deadline); the Figma mock shows October 20.

## Fonts

The design uses Dharma Gothic M (Heavy Italic and Heavy) and Avenir. Both are licensed fonts, so the CSS in `src/app/globals.css` tries, in order:

1. a locally installed copy (`local()`),
2. web font files in `public/fonts/` (see the README there for file names),
3. the Adobe Fonts web project `iel3cpg` (set in `site.json`, overridable with `NEXT_PUBLIC_ADOBE_FONTS_KIT`), which serves `dharma-gothic-m` and `avenir-lt-pro`,
4. free fallbacks from Google Fonts: Saira Extra Condensed for display text and Nunito Sans for body text.

Headlines squeeze themselves to the design width when a wider fallback font is active (`src/lib/fit-text.ts`), so the layout holds either way. Montserrat Bold (nav) loads from Google Fonts.

## Animation

All motion is GSAP + ScrollTrigger and respects `prefers-reduced-motion` (the page simply renders its final state).

- Landing hero (`LandingHero.tsx`): the dashed baton line runs a lap around the hero on load, dots and stickers landing as it passes them; scrolling runs it off again.
- Election info cards (`HowVotingWorks.tsx`): deadline stickers tilt in, the track lines rake into the cards with scroll.
- State hero (`Hero.tsx`): the nine elliptical track arcs draw in on load and rake back out as you scroll; the lanes under "runs this" only draw once scrolling starts, centre lanes first; stickers pop in.
- Cream sections (`TrackShell.tsx`): lanes continue from the hero, the fan below the card draws on scroll, the star sticker pops.
- Race dates (`Dates.tsx`): the dashed baton path draws itself across the section with scroll, waypoint dots pop as the line reaches them, date cards tilt into place.
- FAQ, countdown, checklist, footer: staggered entrances, ring arcs, and the footer track drawing in.

Line geometry was derived from the Figma vectors (the arcs are concentric ellipses because the track pills were scaled non-uniformly). Stickers and icons are the exported SVGs in `public/graphics/`.

## Checklist

Checks are saved in `localStorage` under `bhb-vote-checklist-v1`. "Download checklist" serves `public/checklist.pdf`, which is a print of the hidden page `/checklist/print` (same fonts and artwork as the site). After editing the checklist, run the dev server and `npm run checklist:pdf`, which prints that page with headless Chrome. "Share" uses the Web Share API with a copy-link fallback.

## CMS options

Content is plain JSON on purpose so a git-based CMS can edit it without a database. Simple and free options, in order of fit:

1. **Keystatic** (recommended): free, open source, edits JSON/Markdown in the repo through a friendly UI at `/keystatic`. Local mode needs no accounts; GitHub mode gives editors a login and commits for them. Pairs well with Netlify or Vercel.
2. **Decap CMS**: free, git-based, mature. Served as a static admin page; needs Netlify Identity or a GitHub OAuth app for logins. Older UI than Keystatic.
3. **Sanity (free tier)**: hosted, real-time, generous free plan. More setup (schemas, a Studio) and content moves out of the repo, but the team already uses it on other projects.
4. **TinaCMS (free tier)**: visual editing on top of git. Good UI, but the free cloud tier is tighter than Keystatic's "no cloud at all".

## Deploy

Hosted on Vercel (project `bhb-signaltheory-com`, Signal Theory team) from the `main` branch of this repo; every push to `main` deploys production and other branches get preview URLs. Point the production domain at the project once it is ready, and add that domain to the Adobe Fonts web project so the licensed fonts load there.

## One repo, one site per election year

- `main` is always the live site.
- When a year's site is done, archive it as a branch (`year-2024`, `year-2026`, …) and tag the final commit (`v2024`, `v2026`). Branches keep the old site browsable and buildable; tags mark the exact launch state.
- Build the next refresh on a branch (for example `2028-refresh`) with Vercel preview deployments, then merge to `main` at launch. The old design never has to be deleted first: the merge replaces it and the archive branch keeps it.
- Year-specific content (dates, FAQs, links) lives in `src/content`, so a refresh that keeps the structure is a content edit, and a full redesign swaps components while the content model carries over.
