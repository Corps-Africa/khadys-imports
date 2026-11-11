import Link from "next/link";
import { adminStats } from "@/lib/data";

export default async function AdminHome() {
  const s = await adminStats();
  const cards = [
    { label: "Products on the site", value: s.live, href: "/admin/products" },
    { label: "Hidden (drafts)", value: s.hidden, href: "/admin/products" },
    { label: "Sold out", value: s.soldOut, href: "/admin/products" },
    { label: "Categories", value: s.categories, href: "/admin/categories" },
  ];
  return (
    <>
      <h1 className="font-display text-3xl uppercase tracking-wide">Welcome back 👋</h1>
      <p className="mt-1 text-muted">Here&apos;s a quick look at your shop.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-line bg-white p-5 transition hover:border-gold">
            <p className="font-display text-4xl">{c.value}</p>
            <p className="mt-1 text-sm text-muted">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/admin/products/new" className="bg-ink-texture group rounded-2xl p-6 text-white">
          <p className="text-gold-gradient font-display text-2xl uppercase">+ Add a new product</p>
          <p className="mt-1 text-sm text-white/70">Take photos with your phone, add a price and publish in a minute.</p>
        </Link>
        <Link href="/admin/settings" className="rounded-2xl border border-line bg-white p-6 transition hover:border-gold">
          <p className="font-display text-2xl uppercase">Shop settings</p>
          <p className="mt-1 text-sm text-muted">Update WhatsApp number, phone, address, social links and homepage text.</p>
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-white p-6 text-sm leading-relaxed">
        <h2 className="mb-2 font-display text-lg uppercase tracking-wide">Tips</h2>
        <ul className="list-disc space-y-1.5 pl-5 text-muted">
          <li>Square photos on a plain background look best. The first photo is the main one customers see.</li>
          <li>Tick <b>Featured</b> to show a product on the homepage (up to 8 are shown).</li>
          <li>Leave the price empty to show &ldquo;Ask for price&rdquo;.</li>
          <li>Mark an item <b>Sold out</b> instead of deleting it if it will come back in stock.</li>
          <li>Changes appear on the website immediately.</li>
        </ul>
      </div>
    </>
  );
}
