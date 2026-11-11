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
    <header className="sticky top-0 z-50">
      <div className="bg-gold-gradient px-4 py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-ink sm:text-xs">
        We ship from {shipsFrom} · Retail &amp; wholesale
      </div>
      <div className="border-b border-white/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[72px]">
          <Link href="/" aria-label="Khady's Imports home">
            <Logo logoUrl={logoUrl} />
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-sm font-medium uppercase tracking-wider text-white/80 transition hover:text-gold-light"
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
