type Props = { tag: string; date: string; tone?: "red" | "green"; className?: string };

/** The calendar-style card from the Race Dates section. */
export function DateCard({ tag, date, tone = "red", className = "" }: Props) {
  const top = tone === "red" ? "bg-red-light text-red-dark" : "bg-green-light text-green-dark";
  const body = tone === "red" ? "text-red-dark" : "text-green-dark";
  return (
    <div className={`w-[272px] max-w-full overflow-hidden rounded-[9.6px] border-[2.4px] border-white bg-white ${className}`}>
      <div className={`flex items-center justify-center px-5 py-[20px] ${top}`}>
        <span className="t-display-upright text-[40.8px] leading-none whitespace-nowrap">{tag}</span>
      </div>
      <div className={`flex min-h-[121px] items-center justify-center px-5 ${body}`}>
        <span className="t-display-upright text-center text-[clamp(52px,4.67vw,67.2px)] leading-none">{date}</span>
      </div>
    </div>
  );
}
