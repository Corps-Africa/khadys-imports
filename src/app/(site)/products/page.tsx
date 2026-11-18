import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getCategories, getPublishedProducts } from "@/lib/data";
import { ProductCard } from "@/components/site/product-card";
import { Eyebrow } from "@/components/site/section-heading";
import { HeroBackdrop } from "@/components/site/hero";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse affordable, quality imported products. Order on WhatsApp for delivery across Ghana.",
};

export default function ProductsPage(props: PageProps<"/products">) {
  return (
    <>
      <section className="bg-ink-texture relative overflow-hidden text-white">
        <HeroBackdrop />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <Eyebrow>Our shop</Eyebrow>
          <h1 className="mt-1 animate-fade-up font-display text-4xl uppercase tracking-wide [animation-delay:120ms] sm:text-5xl">
            <span className="text-gold-shimmer">All products</span>
          </h1>
          <p className="mt-3 max-w-xl animate-fade-up text-white/70 [animation-delay:240ms]">
            Add items to your basket and send your order to us on WhatsApp. We&apos;ll confirm the delivery fee and payment.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Suspense fallback={<GridSkeleton />}>
          <Catalogue searchParams={props.searchParams} />
        </Suspense>
      </div>
    </>
  );
}

async function Catalogue({ searchParams }: { searchParams: PageProps<"/products">["searchParams"] }) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : "";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const [cats, all] = await Promise.all([getCategories(), getPublishedProducts()]);

  const needle = q.toLowerCase();
  const products = all.filter(
    (p) =>
      (!category || p.categorySlug === category) &&
      (!needle || p.name.toLowerCase().includes(needle) || p.description.toLowerCase().includes(needle)),
  );
  const visibleCats = cats.filter((c) => all.some((p) => p.categoryId === c.id));
  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
      active ? "border-ink bg-ink text-gold-light shadow-md" : "border-line bg-white hover:-translate-y-0.5 hover:border-gold"
    }`;
  const href = (cat: string) => {
    const params = new URLSearchParams();
    if (cat) params.set("category", cat);
    if (q) params.set("q", q);
    const s = params.toString();
    return `/products${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <form action="/products" className="mb-5 flex gap-2" role="search">
        {category && <input type="hidden" name="category" value={category} />}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search products…"
          aria-label="Search products"
          className="field rounded-full"
        />
        <button className="btn-dark shrink-0">Search</button>
      </form>

      <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href={href("")} className={chip(!category)}>
          All
        </Link>
        {visibleCats.map((c) => (
          <Link key={c.id} href={href(c.slug)} className={chip(category === c.slug)}>
            {c.name}
          </Link>
        ))}
      </div>

      <p className="mb-4 text-sm text-muted">
        {products.length} product{products.length === 1 ? "" : "s"}
        {q && (
          <>
            {" "}
            for “<span className="font-semibold text-ink">{q}</span>” ·{" "}
            <Link href={category ? `/products?category=${category}` : "/products"} className="underline">
              clear
            </Link>
          </>
        )}
      </p>

      {products.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <div key={p.id} data-reveal style={{ "--reveal-delay": `${(i % 4) * 80}ms` } as React.CSSProperties}>
              <ProductCard p={p} priority={i < 4} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-muted">
          Nothing here yet. Can&apos;t find what you need? Message us on WhatsApp — we can source it for you.
        </div>
      )}
    </>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-sand" />
      ))}
    </div>
  );
}
