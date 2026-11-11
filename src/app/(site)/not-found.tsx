import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="font-display text-6xl text-gold-gradient">404</p>
      <h1 className="mt-2 font-display text-2xl uppercase tracking-wide">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-muted">The product may have sold out or been removed.</p>
      <Link href="/products" className="btn-gold mt-6">
        Back to the shop
      </Link>
    </div>
  );
}
