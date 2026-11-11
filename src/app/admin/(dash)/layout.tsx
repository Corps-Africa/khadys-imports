import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";
import { LogoMark } from "@/components/site/logo";
import { AdminNav, NavList } from "@/components/admin/admin-nav";

export default function DashLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="bg-ink text-white md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:block md:px-5 md:py-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <span className="font-display uppercase leading-tight tracking-wide">
              <span className="text-gold-gradient block text-lg">Khady&rsquo;s</span>
              <span className="block text-[11px] text-white/60">Shop admin</span>
            </span>
          </Link>
          <Link href="/" target="_blank" className="text-xs text-gold-light underline md:hidden">
            View site ↗
          </Link>
        </div>
        <Suspense fallback={<NavList path="" />}>
          <AdminNav />
        </Suspense>
        <div className="hidden space-y-2 px-5 pt-6 md:block">
          <Link href="/" target="_blank" className="block text-sm text-gold-light hover:underline">
            View website ↗
          </Link>
          <form action={logout}>
            <button className="text-sm text-white/60 hover:text-white">Sign out</button>
          </form>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <Suspense fallback={<div className="p-8 text-muted">Loading…</div>}>
          <Gate>{children}</Gate>
        </Suspense>
        <form action={logout} className="px-4 pb-8 md:hidden">
          <button className="text-sm text-muted underline">Sign out</button>
        </form>
      </div>
    </div>
  );
}

async function Gate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">{children}</div>;
}
