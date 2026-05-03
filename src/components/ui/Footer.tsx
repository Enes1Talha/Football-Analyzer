"use client";

export default function Footer() {
  return (
    <footer className="border-t border-pitch-border bg-pitch-dark/60 backdrop-blur-sm py-5">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs font-mono text-zinc-600">
          Football Analyzer — built with Next.js &amp; API-Football
        </span>

        <a
          href="#"
          className="group flex items-center gap-2 text-xs font-mono tracking-widest uppercase transition-all"
        >
          <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
            Powered by
          </span>
          <span
            className="font-bold text-white group-hover:text-neon-green transition-colors"
            style={{
              textShadow: "0 0 8px rgba(57,255,20,0)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.textShadow =
                "0 0 8px rgba(57,255,20,0.6), 0 0 20px rgba(57,255,20,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.textShadow =
                "0 0 8px rgba(57,255,20,0)";
            }}
          >
            Kayıp Krampon
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-neon" />
        </a>

        <span className="text-xs font-mono text-zinc-600">
          Data by RapidAPI · API-Football
        </span>
      </div>
    </footer>
  );
}
