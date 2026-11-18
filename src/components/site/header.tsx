import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "./logo";
import { CartButton } from "./cart";
import { MobileMenu } from "./mobile-menu";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ logoUrl, shipsFrom }: { logoUrl?: string; shipsFrom: string }) {
  return (
    <header id="site-header" className="group/header sticky top-0 z-50">
      <div className="bg-gold-gradient px-4 py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-ink sm:text-xs">
        We ship from {shipsFrom} · Retail &amp; wholesale
      </div>
      <div className="border-b border-white/10 bg-ink/95 backdrop-blur transition-shadow duration-300 group-data-[scrolled]/header:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 transition-[height] duration-300 sm:h-[72px] sm:group-data-[scrolled]/header:h-16">
          <Link href="/" aria-label="Khady's Imports home">
            <Logo logoUrl={logoUrl} />
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="relative py-1 text-sm font-medium uppercase tracking-wider text-white/80 transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold-light after:transition-transform after:duration-300 hover:text-gold-light hover:after:scale-x-100"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <CartButton />
            <Suspense fallback={<span className="block h-11 w-11 md:hidden" />}>
              <MobileMenu items={NAV} />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
