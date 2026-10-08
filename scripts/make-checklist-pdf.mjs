// Builds public/checklist.pdf from src/content/checklist.json. Run: npm run checklist:pdf
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { readFileSync, writeFileSync } from "node:fs";

const groups = JSON.parse(readFileSync(new URL("../src/content/checklist.json", import.meta.url), "utf8"));
const site = JSON.parse(readFileSync(new URL("../src/content/site.json", import.meta.url), "utf8"));

const blueDark = rgb(0x1c / 255, 0x4b / 255, 0x4f / 255);
const blueLight = rgb(0x4f / 255, 0xc4 / 255, 0xdd / 255);
const cream = rgb(0xe7 / 255, 0xe3 / 255, 0xd8 / 255);
const redLight = rgb(0xff / 255, 0x22 / 255, 0x3d / 255);

const doc = await PDFDocument.create();
doc.setTitle("Race like you mean it: plan-to-vote checklist");
doc.setAuthor(site.name);
const page = doc.addPage([612, 792]);
const bold = await doc.embedFont(StandardFonts.HelveticaBold);
const regular = await doc.embedFont(StandardFonts.Helvetica);

page.drawRectangle({ x: 0, y: 792 - 130, width: 612, height: 130, color: blueDark });
page.drawText("RACE LIKE YOU MEAN IT", { x: 48, y: 792 - 70, size: 30, font: bold, color: blueLight });
page.drawText("Your plan-to-vote checklist", { x: 48, y: 792 - 98, size: 13, font: regular, color: cream });

let y = 792 - 180;
for (const group of groups) {
  page.drawText(group.title.toUpperCase(), { x: 48, y, size: 11, font: bold, color: blueDark });
  y -= 28;
  for (const item of group.items) {
    page.drawCircle({ x: 60, y: y + 4, size: 8, borderColor: blueDark, borderWidth: 1.5, color: rgb(1, 1, 1) });
    page.drawText(item.label.replace(/’/g, "'"), { x: 80, y, size: 12, font: regular, color: blueDark });
    y -= 30;
  }
  y -= 14;
}

page.drawRectangle({ x: 48, y: 70, width: 516, height: 2, color: redLight });
page.drawText(`${site.name}  -  ${site.url.replace(/^https?:\/\//, "")}`, { x: 48, y: 50, size: 10, font: regular, color: blueDark });

writeFileSync(new URL("../public/checklist.pdf", import.meta.url), await doc.save());
console.log("wrote public/checklist.pdf");
