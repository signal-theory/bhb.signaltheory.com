/**
 * Nine running lanes, 57px apart in the 1440 design, centered on the page.
 * They are plain divs so the same lanes line up in the hero and in the cream section below it,
 * and GSAP can "rake" them in with scaleY.
 */
export const LANE_COUNT = 9;

export function Lanes({ className = "", lineClass = "bg-blue-light", laneClass = "" }: { className?: string; lineClass?: string; laneClass?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute left-1/2 w-[calc(8*var(--lane-gap)+var(--lane-w))] -translate-x-1/2 ${className}`}>
      {Array.from({ length: LANE_COUNT }, (_, i) => (
        <span
          key={i}
          data-lane
          className={`absolute top-0 h-full w-(--lane-w) rounded-full ${lineClass} ${laneClass}`}
          style={{ left: `calc(${i} * var(--lane-gap))` }}
        />
      ))}
    </div>
  );
}
