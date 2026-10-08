/** Tilted green deadline card from the landing page ("MISSOURI DEADLINE / OCTOBER 7"). */
export function DeadlineSticker({ tag, date, className = "", style }: { tag: string; date: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`w-[227px] max-w-full overflow-hidden rounded-[8px] border-2 border-black bg-white ${className}`} style={style}>
      <div className="flex items-center justify-center bg-green-light px-[17px] py-[17px]">
        <span className="t-display text-[34px] leading-[1.2] whitespace-nowrap text-green-dark">{tag}</span>
      </div>
      <div className="flex min-h-[92px] items-center justify-center px-[17px]">
        <span className="t-display-upright text-center text-[56.8px] leading-[1.2] text-green-dark">{date}</span>
      </div>
    </div>
  );
}
