import Image from "next/image";
import Link from "next/link";
import type { PublicProduct } from "@/lib/data";
import { AVAILABILITY_LABEL, formatCedi } from "@/lib/format";
import { AddToCartButton } from "./cart";

export function ProductImage({
  src,
  alt,
  sizes,
  priority,
  className = "",
}: {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div className={`bg-ink-texture absolute inset-0 grid place-items-center ${className}`}>
        <div className="text-center">
          <svg viewBox="0 0 24 24" className="mx-auto h-10 w-10 text-gold/60" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.8" />
            <path d="M21 16l-5-5-8 8" />
          </svg>
          <p className="mt-2 text-[11px] uppercase tracking-widest text-gold/60">Photo coming soon</p>
        </div>
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
}

export function AvailabilityBadge({ value }: { value: PublicProduct["availability"] }) {
  const style =
    value === "in_stock"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : value === "preorder"
        ? "bg-amber-50 text-amber-800 ring-amber-200"
        : "bg-neutral-100 text-neutral-500 ring-neutral-200";
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${style}`}>{AVAILABILITY_LABEL[value]}</span>;
}

export function ProductCard({ p, priority }: { p: PublicProduct; priority?: boolean }) {
  const soldOut = p.availability === "sold_out";
  const onSale = p.price !== null && p.oldPrice !== null && p.oldPrice > p.price;
  return (
    <article className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white hover:border-gold/50">
      <Link href={`/products/${p.slug}`} className="relative block aspect-square overflow-hidden bg-sand">
        <ProductImage
          src={p.images[0]}
          alt={p.name}
          priority={priority}
          sizes="(min-width:1024px) 280px, (min-width:640px) 33vw, 50vw"
          className="transition duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          {onSale && <span className="rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold text-ink">Sale</span>}
          {p.availability !== "in_stock" && <AvailabilityBadge value={p.availability} />}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        {p.categoryName && <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{p.categoryName}</p>}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug sm:text-[15px]">
          <Link href={`/products/${p.slug}`} className="hover:text-gold-dark">
            {p.name}
          </Link>
        </h3>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1">
          <span className="font-display text-lg text-ink">{p.price !== null ? formatCedi(p.price) : "Ask for price"}</span>
          {onSale && <span className="text-xs text-muted line-through">{formatCedi(p.oldPrice)}</span>}
        </div>
        {p.wholesalePrice !== null && (
          <p className="text-[11px] text-gold-dark">
            Wholesale {formatCedi(p.wholesalePrice)}
            {p.wholesaleMinQty ? ` (${p.wholesaleMinQty}+ pcs)` : ""}
          </p>
        )}
        <div className="pt-2">
          <AddToCartButton
            disabled={soldOut}
            label={soldOut ? "Sold out" : p.availability === "preorder" ? "Pre-order" : "Add to basket"}
            className="btn-dark w-full px-3 py-2 text-xs sm:text-sm"
            product={{ slug: p.slug, name: p.name, price: p.price, image: p.images[0] }}
          />
        </div>
      </div>
    </article>
  );
}
