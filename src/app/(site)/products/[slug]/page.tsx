import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductBySlug, getPublishedProducts, getSettings } from "@/lib/data";
import { formatCedi, whatsappLink } from "@/lib/format";
import { AddToCartButton } from "@/components/site/cart";
import { AvailabilityBadge, ProductCard } from "@/components/site/product-card";
import { Gallery } from "@/components/site/gallery";
import { GlobeIcon, TruckIcon, WhatsAppIcon } from "@/components/site/icons";

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: p.description.slice(0, 160) || `${p.name} – order on WhatsApp from Khady's Imports.`,
    openGraph: { images: p.images[0] ? [p.images[0]] : ["/brand/logo-mockup.jpg"] },
  };
}

export default function ProductPage(props: PageProps<"/products/[slug]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <Suspense fallback={<DetailSkeleton />}>
        <ProductDetail params={props.params} />
      </Suspense>
    </div>
  );
}

async function ProductDetail({ params }: { params: PageProps<"/products/[slug]">["params"] }) {
  const { slug } = await params;
  const [p, s, all] = await Promise.all([getProductBySlug(slug), getSettings(), getPublishedProducts()]);
  if (!p) notFound();

  const soldOut = p.availability === "sold_out";
  const onSale = p.price !== null && p.oldPrice !== null && p.oldPrice > p.price;
  const related = all.filter((x) => x.id !== p.id && x.categoryId === p.categoryId).slice(0, 4);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const message = `Hello ${s.businessName}! I'm interested in: ${p.name}${
    p.price !== null ? ` (${formatCedi(p.price)})` : ""
  }\n${siteUrl}/products/${p.slug}\n\nIs it available?`;

  return (
    <>
      <nav className="mb-5 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/products" className="hover:text-gold-dark">
          Shop
        </Link>
        {p.categorySlug && (
          <>
            {" / "}
            <Link href={`/products?category=${p.categorySlug}`} className="hover:text-gold-dark">
              {p.categoryName}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <div className="animate-fade-up">
          <Gallery images={p.images} name={p.name} />
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <AvailabilityBadge value={p.availability} />
            {p.origin && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-semibold text-gold-dark">
                <GlobeIcon className="h-3.5 w-3.5" /> Imported from {p.origin}
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl uppercase leading-tight tracking-wide sm:text-4xl">{p.name}</h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl text-gold-dark">{p.price !== null ? formatCedi(p.price) : "Ask for price"}</span>
            {onSale && <span className="text-lg text-muted line-through">{formatCedi(p.oldPrice)}</span>}
          </div>

          {p.wholesalePrice !== null && (
            <div className="mt-4 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm">
              <span className="font-semibold">Wholesale price:</span> {formatCedi(p.wholesalePrice)} each
              {p.wholesaleMinQty ? ` when you buy ${p.wholesaleMinQty} or more` : ""}.
            </div>
          )}

          <div className="mt-6 space-y-3">
            <AddToCartButton
              withQty
              disabled={soldOut}
              label={soldOut ? "Sold out" : p.availability === "preorder" ? "Add pre-order to basket" : "Add to basket"}
              className="btn-dark py-3 text-base"
              product={{ slug: p.slug, name: p.name, price: p.price, image: p.images[0] }}
            />
            <a href={whatsappLink(s.whatsappNumber, message)} target="_blank" rel="noopener" className="btn-whatsapp w-full py-3 text-base">
              <WhatsAppIcon /> {soldOut ? "Ask when it's back" : "Order this on WhatsApp"}
            </a>
          </div>

          {p.description && (
            <div className="mt-8 border-t border-line pt-6">
              <h2 className="mb-2 font-display text-lg uppercase tracking-wide">Details</h2>
              <div className="whitespace-pre-line text-[15px] leading-relaxed text-ink/80">{p.description}</div>
            </div>
          )}

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-white p-4 text-sm text-muted ring-1 ring-line">
            <TruckIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
            <p>{s.deliveryInfo}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <p data-reveal className="font-accent text-lg italic text-gold-dark">More to love</p>
          <h2 data-reveal className="mb-6 font-display text-2xl uppercase tracking-wide">You may also like</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {related.map((r, i) => (
              <div key={r.id} data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
                <ProductCard p={r} />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-square animate-pulse rounded-2xl bg-sand" />
      <div className="space-y-4">
        <div className="h-10 w-3/4 animate-pulse rounded bg-sand" />
        <div className="h-8 w-1/3 animate-pulse rounded bg-sand" />
        <div className="h-12 animate-pulse rounded-full bg-sand" />
      </div>
    </div>
  );
}
