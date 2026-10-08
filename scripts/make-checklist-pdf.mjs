// Prints /checklist/print with headless Chrome into public/checklist.pdf.
// Run the dev server first (npm run dev), then: npm run checklist:pdf
import { spawn } from "node:child_process";
import { existsSync, rmSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const url = process.env.CHECKLIST_URL ?? "http://localhost:3000/checklist/print";
const out = fileURLToPath(new URL("../public/checklist.pdf", import.meta.url));
const chrome =
  process.env.CHROME_PATH ??
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(existsSync);

if (!chrome) {
  console.error("Chrome not found. Set CHROME_PATH to the browser binary.");
  process.exit(1);
}
try {
  await fetch(url, { method: "HEAD" });
} catch {
  console.error(`Cannot reach ${url}. Start the site first (npm run dev) or set CHECKLIST_URL.`);
  process.exit(1);
}

const profile = fileURLToPath(new URL("../.next/chrome-pdf-profile", import.meta.url));
rmSync(profile, { recursive: true, force: true });
if (existsSync(out)) rmSync(out);

// Headless Chrome does not always exit after printing, so wait for the file and stop it ourselves.
const child = spawn(
  chrome,
  ["--headless=new", "--disable-gpu", "--no-first-run", `--user-data-dir=${profile}`, "--no-pdf-header-footer", "--virtual-time-budget=10000", `--print-to-pdf=${out}`, url],
  { stdio: "ignore", detached: true },
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
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
if (!existsSync(out) || statSync(out).size === 0) {
  console.error("Chrome did not produce the PDF.");
  process.exit(1);
}
console.log(`wrote public/checklist.pdf (${Math.round(statSync(out).size / 1024)} KB)`);
