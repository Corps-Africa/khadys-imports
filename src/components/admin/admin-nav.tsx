"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/settings", label: "Shop settings" },
];

export function AdminNav() {
  return <NavList path={usePathname()} />;
}

/** Rendered while the current path is still unknown (prerender). */
export function NavList({ path }: { path: string }) {
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-3 md:pb-0">
      {ITEMS.map((i) => {
        const active = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active ? "bg-gold text-ink" : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
