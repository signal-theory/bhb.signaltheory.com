// Screenshots /og/<variant> with headless Chrome into public/og-images/<variant>.png (1200 x 630).
// Run the dev server first (npm run dev), then: npm run og:images
import { spawn } from "node:child_process";
import { existsSync, rmSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const base = process.env.SITE_URL ?? "http://localhost:3000";
const variants = ["home", "missouri", "kansas", "texas"];
const chrome =
  process.env.CHROME_PATH ??
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(existsSync);
if (!chrome) {
  console.error("Chrome not found. Set CHROME_PATH to the browser binary.");
  process.exit(1);
}
try {
  await fetch(`${base}/og/home`, { method: "HEAD" });
} catch {
  console.error(`Cannot reach ${base}. Start the site first (npm run dev) or set SITE_URL.`);
  process.exit(1);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const variant of variants) {
  const out = fileURLToPath(new URL(`../public/og-images/${variant}.png`, import.meta.url));
  const profile = fileURLToPath(new URL(`../.next/chrome-og-${variant}`, import.meta.url));
  rmSync(profile, { recursive: true, force: true });
  if (existsSync(out)) rmSync(out);
  // Headless Chrome does not always exit after a screenshot, so wait for the file and stop it ourselves.
  const child = spawn(
    chrome,
    ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", `--user-data-dir=${profile}`, "--window-size=1200,630", "--virtual-time-budget=8000", `--screenshot=${out}`, `${base}/og/${variant}`],
    { stdio: "ignore", detached: true },
  );
  let size = 0;
  for (let i = 0; i < 90; i++) {
    await sleep(500);
    if (existsSync(out)) {
      const now = statSync(out).size;
      if (now > 0 && now === size) break;
      size = now;
    }
  }
  try {
    process.kill(-child.pid, "SIGKILL");
  } catch {
    /* already gone */
  }
  rmSync(profile, { recursive: true, force: true });
  if (!existsSync(out)) {
    console.error(`Chrome did not produce ${variant}.png`);
    process.exit(1);
  }
  console.log(`wrote public/og-images/${variant}.png (${Math.round(statSync(out).size / 1024)} KB)`);
}
