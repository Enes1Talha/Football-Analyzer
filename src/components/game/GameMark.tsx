/** The two sides meet around one football. Decorative beside the page/link label. */
export default function GameMark({ className = "", monochrome = false }: { className?: string; monochrome?: boolean }) {
  const left = monochrome ? "currentColor" : "#39FF14";
  const right = monochrome ? "currentColor" : "#00FFFF";
  return <svg viewBox="0 0 96 104" fill="none" aria-hidden="true" focusable="false" className={className}>
    <path d="M48 5 86 19v31c0 21-17 37-38 49C27 87 10 71 10 50V19L48 5Z" fill={monochrome ? "none" : "#0D1513"} />
    <path d="M43 7 12 20v30c0 19 14 33 31 44" stroke={left} strokeWidth="4" strokeLinecap="square" />
    <path d="m53 7 31 13v30c0 19-14 33-31 44" stroke={right} strokeWidth="4" strokeLinecap="square" />
    <path d="m21 29 8 5v25l-8-6V29Z" fill={left} />
    <path d="m75 29-8 5v25l8-6V29Z" fill={right} />
    <circle cx="48" cy="44" r="20" fill={monochrome ? "none" : "#E9FFF2"} stroke={monochrome ? "currentColor" : "#E9FFF2"} strokeWidth="2.5" />
    <g fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className={monochrome ? "" : "text-pitch-black"}>
      <path d="m48 35 8 6-3 9H43l-3-9 8-6Z" />
      <path d="M48 24v11m-19 3 11 3m-4 19 7-10m17 10-7-10m14-12-11 3" fill="none" />
      <path d="m43 25 5 4 5-4m-24 8 5 6-5 4m3 12 7 1 2 7m14 0 2-7 7-1m3-12-5-4 5-6" fill="none" />
    </g>
    <path d="M35 76h5m6 0h5m6 0h5" stroke={left} strokeWidth="4" strokeLinecap="round" />
  </svg>;
}
