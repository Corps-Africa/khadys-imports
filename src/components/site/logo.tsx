import Image from "next/image";

/** Simplified flat version of the Khady's globe mark, for use on dark backgrounds. */
export function LogoMark({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="kg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8dc85" />
          <stop offset=".55" stopColor="#d4a537" />
          <stop offset="1" stopColor="#a87c1e" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#kg)" strokeLinecap="round">
        <path d="M50 9C34 2 13 11 8 30c-3 12 2 22 8 28" strokeWidth="2.6" />
        <path d="M46 16a20 20 0 1 0 0 34" strokeWidth="3.4" />
        <path d="M39 17c-8 4-12 10-12 17s4 13 12 17" strokeWidth="3" />
        <path d="M16 27h26M15 40h26M32 14c-3 6-4.5 13-4.5 20" strokeWidth="3" />
      </g>
      <path d="M49 4l6 6-9 1.5z" fill="url(#kg)" />
      <path d="M11.5 61l-4-7.5 8 .5z" fill="url(#kg)" />
    </svg>
  );
}

export function Logo({ logoUrl, compact = false }: { logoUrl?: string; compact?: boolean }) {
  if (logoUrl) {
    return (
      <Image src={logoUrl} alt="Khady's Imports" width={180} height={56} className="h-11 w-auto object-contain" priority />
    );
  }
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className={compact ? "h-9 w-9" : "h-11 w-11"} />
      <span className="flex flex-col font-display uppercase leading-[0.95]">
        <span className={`text-gold-gradient font-semibold tracking-wide ${compact ? "text-lg" : "text-xl"}`}>Khady&rsquo;s</span>
        <span className={`text-gold-gradient tracking-[0.12em] ${compact ? "text-sm" : "text-base"}`}>Imports</span>
      </span>
    </span>
  );
}
