"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full p-2.5 text-white hover:bg-white/10"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-full border-b border-white/10 bg-ink px-4 pb-4 shadow-xl" aria-label="Mobile">
          {items.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`block border-b border-white/5 py-3.5 font-display text-lg uppercase tracking-wider ${
                pathname === n.href ? "text-gold-light" : "text-white/85"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
