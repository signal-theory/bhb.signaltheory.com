import type { ReactNode } from "react";

/**
 * Renders the small markdown subset used in content JSON: paragraphs separated by blank lines,
 * "- " bullet lists, **bold** and [links](https://...). Links open in a new tab.
 */
const INLINE = /(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)/g;

function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    const start = m.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    if (m[1]) {
      const href = m[3];
      const external = /^https?:/i.test(href);
      out.push(
        <a
          key={`${keyPrefix}-${i++}`}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="font-[800] underline decoration-red-light decoration-2 underline-offset-4 hover:text-red-dark"
        >
          {m[2]}
        </a>,
      );
    } else if (m[4]) {
      out.push(<strong key={`${keyPrefix}-${i++}`}>{m[5]}</strong>);
    }
    last = start + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={bi} className="space-y-2">
              {lines.map((l, li) => (
                <li key={li} className="relative pl-6 before:absolute before:top-[0.55em] before:left-1 before:size-[9px] before:rounded-full before:bg-red-light">
                  {inline(l.trim().slice(2), `${bi}-${li}`)}
                </li>
              ))}
            </ul>
          );
        }
        return <p key={bi}>{inline(lines.join(" "), `${bi}`)}</p>;
      })}
    </div>
  );
}
