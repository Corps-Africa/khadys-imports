"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { formatCedi, whatsappLink } from "@/lib/format";
import { WhatsAppIcon } from "./icons";

export type CartItem = {
  slug: string;
  name: string;
  price: number | null;
  image?: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "khadys-cart-v1";

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}

export function CartProvider({
  children,
  whatsappNumber,
  businessName,
}: {
  children: React.ReactNode;
  whatsappNumber: string;
  businessName: string;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate once from storage
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, loaded]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.slug === item.slug);
      if (found) return prev.map((i) => (i.slug === item.slug ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { ...item, qty }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.slug !== slug) : prev.map((i) => (i.slug === slug ? { ...i, qty } : i)),
    );
  }, []);

  const remove = useCallback((slug: string) => setItems((p) => p.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.reduce((n, i) => n + i.qty, 0), open, setOpen, add, setQty, remove, clear }),
    [items, open, add, setQty, remove, clear],
  );

  return (
    <Ctx value={value}>
      {children}
      <CartDrawer whatsappNumber={whatsappNumber} businessName={businessName} />
    </Ctx>
  );
}

function buildOrderMessage(items: CartItem[], businessName: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const lines = items.map((i, n) => {
    const price = i.price !== null ? ` – ${formatCedi(i.price * i.qty)}` : " – price on request";
    return `${n + 1}. ${i.name} × ${i.qty}${price}\n   ${origin}/products/${i.slug}`;
  });
  const priced = items.filter((i) => i.price !== null);
  const total = priced.reduce((s, i) => s + (i.price ?? 0) * i.qty, 0);
  return [
    `Hello ${businessName}! 👋 I'd like to order:`,
    "",
    ...lines,
    "",
    priced.length ? `Estimated total: ${formatCedi(total)}${priced.length < items.length ? " + items on request" : ""}` : "",
    "",
    "My name: ",
    "Delivery location: ",
  ]
    .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
    .join("\n");
}

function CartDrawer({ whatsappNumber, businessName }: { whatsappNumber: string; businessName: string }) {
  const { items, open, setOpen, setQty, remove, clear } = useCart();
  const total = items.reduce((s, i) => s + (i.price ?? 0) * i.qty, 0);
  const hasUnpriced = items.some((i) => i.price === null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-ink/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        role="dialog"
        aria-label="Your order basket"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line bg-ink px-5 py-4 text-white">
          <h2 className="font-display text-xl uppercase tracking-wide">Your basket</h2>
          <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/10" aria-label="Close">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-muted">Your basket is empty.</p>
            <Link href="/products" onClick={() => setOpen(false)} className="btn-gold">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {items.map((i) => (
                <li key={i.slug} className="flex gap-3 py-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-sand">
                    {i.image && <Image src={i.image} alt="" fill sizes="80px" className="object-cover" />}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="line-clamp-2 text-sm font-semibold">{i.name}</p>
                    <p className="text-sm text-gold-dark">{i.price !== null ? formatCedi(i.price) : "Price on request"}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-line bg-white">
                        <button className="px-3 py-1 text-lg" onClick={() => setQty(i.slug, i.qty - 1)} aria-label="Decrease">
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
                        <button className="px-3 py-1 text-lg" onClick={() => setQty(i.slug, i.qty + 1)} aria-label="Increase">
                          +
                        </button>
                      </div>
                      <button onClick={() => remove(i.slug)} className="text-xs text-muted underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-line bg-white px-5 py-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Estimated total</span>
                <span className="font-display text-xl">
                  {formatCedi(total)}
                  {hasUnpriced && <span className="text-xs text-muted"> + items on request</span>}
                </span>
              </div>
              <p className="text-xs text-muted">
                We&apos;ll confirm availability, delivery fee and payment (MoMo or cash) with you on WhatsApp.
              </p>
              <a
                href={whatsappLink(whatsappNumber, buildOrderMessage(items, businessName))}
                target="_blank"
                rel="noopener"
                className="btn-whatsapp w-full py-3.5 text-base"
              >
                <WhatsAppIcon className="h-5 w-5" /> Send order on WhatsApp
              </a>
              <button onClick={clear} className="w-full text-xs text-muted underline">
                Clear basket
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      className="relative rounded-full p-2.5 text-white transition hover:bg-white/10"
      aria-label={`Open basket (${count} items)`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 7h12l-1 13H7L6 7z" />
        <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink">
          {count}
        </span>
      )}
    </button>
  );
}

export function AddToCartButton({
  product,
  disabled,
  className = "btn-dark",
  label = "Add to basket",
  withQty = false,
}: {
  product: Omit<CartItem, "qty">;
  disabled?: boolean;
  className?: string;
  label?: string;
  withQty?: boolean;
}) {
  const { add } = useCart();
  const [qty, setQtyLocal] = useState(1);
  return (
    <div className="flex gap-2">
      {withQty && (
        <div className="flex items-center rounded-full border border-line bg-white">
          <button className="px-3.5 py-2 text-lg" onClick={() => setQtyLocal((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            −
          </button>
          <span className="w-7 text-center font-semibold">{qty}</span>
          <button className="px-3.5 py-2 text-lg" onClick={() => setQtyLocal((q) => q + 1)} aria-label="Increase quantity">
            +
          </button>
        </div>
      )}
      <button disabled={disabled} onClick={() => add(product, qty)} className={`${className} flex-1`}>
        {label}
      </button>
    </div>
  );
}
