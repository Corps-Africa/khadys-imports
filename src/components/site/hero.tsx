import Image from "next/image";

export function splitOrigins(shipsFrom: string) {
  return shipsFrom
    .split(/,|&|\band\b/i)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Soft drifting gold glows + faint globe lines behind the hero. Decorative only. */
export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -left-24 top-10 h-72 w-72 animate-float rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute -right-10 bottom-0 h-96 w-96 animate-float rounded-full bg-gold/10 blur-3xl [animation-delay:-3s]" />
      <svg viewBox="0 0 800 400" className="absolute inset-x-0 bottom-0 h-full w-full opacity-[0.07]" fill="none" stroke="#f2cf6b">
        {[60, 120, 180, 240, 300].map((r) => (
          <ellipse key={r} cx="400" cy="420" rx={r * 1.6} ry={r} strokeWidth="1" />
        ))}
        {[-300, -150, 0, 150, 300].map((x) => (
          <path key={x} d={`M400 420 Q ${400 + x} 120 ${400 + x * 1.6} 0`} strokeWidth="1" />
        ))}
      </svg>
    </div>
  );
}

/** Dashed gold rings that slowly rotate, with a small "shipment" dot orbiting. */
export function OrbitRings({ className = "" }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow" fill="none">
        <circle cx="100" cy="100" r="96" stroke="#d4a537" strokeOpacity="0.45" strokeWidth="0.8" strokeDasharray="2 6" />
        <circle cx="100" cy="4" r="3.2" fill="#f2cf6b" />
      </svg>
      <svg viewBox="0 0 200 200" className="absolute inset-[9%] h-[82%] w-[82%] animate-spin-slower" fill="none">
        <circle cx="100" cy="100" r="96" stroke="#d4a537" strokeOpacity="0.3" strokeWidth="0.8" />
        <path d="M100 4 l5 3 -5 3z" fill="#d4a537" />
      </svg>
    </div>
  );
}

export function HeroVisual({ src, alt, origins }: { src: string; alt: string; origins: string }) {
  const list = splitOrigins(origins).slice(0, 3);
  const spots = [
    "left-0 top-[12%] -translate-x-3 sm:-translate-x-6",
    "right-0 top-[44%] translate-x-3 sm:translate-x-6",
    "bottom-[6%] left-[10%]",
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md animate-fade-in [animation-delay:200ms] md:max-w-none">
      <OrbitRings className="absolute -inset-[8%]" />
      <div className="absolute inset-[6%] animate-float">
        <div className="absolute -inset-4 rounded-[2rem] bg-gold/15 blur-2xl" aria-hidden />
        <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] border border-gold/30 shadow-2xl">
          <Image src={src} alt={alt} fill priority sizes="(min-width:768px) 480px, 90vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" aria-hidden />
        </div>
      </div>
      {list.map((o, i) => (
        <div
          key={o}
          className={`absolute ${spots[i]} animate-fade-up`}
          style={{ animationDelay: `${700 + i * 180}ms` }}
        >
          <div
            className="flex animate-float items-center gap-2 rounded-full border border-gold/30 bg-ink/85 px-3.5 py-2 shadow-xl backdrop-blur"
            style={{ animationDelay: `${-i * 1.7}s` }}
          >
            <span className="h-2 w-2 rounded-full bg-gold-light shadow-[0_0_10px_#f2cf6b]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
              From <span className="font-accent text-sm normal-case italic tracking-normal text-gold-light">{o}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Infinite gold marquee strip. */
export function Ticker({ items }: { items: string[] }) {
  const row = (hidden?: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((t) => (
        <span key={t} className="flex items-center">
          <span className="px-6 font-display text-sm uppercase tracking-[0.2em] text-ink sm:text-base">{t}</span>
          <span className="font-accent text-lg text-ink/50">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="bg-gold-gradient overflow-hidden py-3">
      <div className="marquee-track flex w-max animate-marquee">
        {row()}
        {row(true)}
        {row(true)}
        {row(true)}
      </div>
    </div>
  );
}
