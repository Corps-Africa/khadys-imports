"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import type { Category, Product } from "@/db/schema";
import { deleteProduct, saveProduct } from "@/app/admin/actions";
import { ImageUploader } from "./image-uploader";

const ORIGINS = ["China", "Turkey", "Nigeria"];

export function ProductForm({
  product,
  categories,
  useBlob,
}: {
  product?: Product;
  categories: Category[];
  useBlob: boolean;
}) {
  const [state, action, pending] = useActionState(saveProduct, undefined);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const fe = state?.fieldErrors ?? {};
  const num = (n: number | null | undefined) => (n === null || n === undefined ? "" : String(n));

  return (
    <>
      <form
        action={action}
        // Submit manually so React doesn't reset the fields when validation fails.
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          startTransition(() => action(fd));
        }}
        className="space-y-6"
      >
        {product && <input type="hidden" name="id" value={product.id} />}
        <input type="hidden" name="images" value={JSON.stringify(images)} />

        <Card title="Photos" hint="The first photo is the main one. Use the arrows to reorder.">
          <ImageUploader value={images} onChange={setImages} useBlob={useBlob} />
          <Err msg={fe.images} />
        </Card>

        <Card title="Product details">
          <div>
            <label className="label" htmlFor="name">
              Product name *
            </label>
            <input id="name" name="name" defaultValue={product?.name} required className="field" placeholder="e.g. Ladies leather tote bag" />
            <Err msg={fe.name} />
          </div>
          <div>
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={product?.description}
              className="field"
              placeholder="Size, colours available, material, what's in the box…"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="categoryId">
                Category
              </label>
              <select id="categoryId" name="categoryId" defaultValue={num(product?.categoryId)} className="field">
                <option value="">— No category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="hint">
                <Link href="/admin/categories" className="underline">
                  Manage categories
                </Link>
              </p>
            </div>
            <div>
              <label className="label" htmlFor="origin">
                Shipped from
              </label>
              <input id="origin" name="origin" list="origins" defaultValue={product?.origin ?? ""} className="field" placeholder="China" />
              <datalist id="origins">
                {ORIGINS.map((o) => (
                  <option key={o} value={o} />
                ))}
              </datalist>
            </div>
          </div>
        </Card>

        <Card title="Price (GH₵)" hint="Leave the price empty to show “Ask for price”.">
          <div className="grid gap-4 sm:grid-cols-2">
            <MoneyField name="price" label="Selling price" defaultValue={num(product?.price)} error={fe.price} />
            <MoneyField
              name="oldPrice"
              label="Old price (optional)"
              hint="Shows as crossed out with a “Sale” badge"
              defaultValue={num(product?.oldPrice)}
              error={fe.oldPrice}
            />
            <MoneyField name="wholesalePrice" label="Wholesale price (optional)" defaultValue={num(product?.wholesalePrice)} error={fe.wholesalePrice} />
            <div>
              <label className="label" htmlFor="wholesaleMinQty">
                Wholesale minimum quantity
              </label>
              <input
                id="wholesaleMinQty"
                name="wholesaleMinQty"
                inputMode="numeric"
                defaultValue={num(product?.wholesaleMinQty)}
                className="field"
                placeholder="e.g. 6"
              />
              <Err msg={fe.wholesaleMinQty} />
            </div>
          </div>
        </Card>

        <Card title="Visibility">
          <div>
            <label className="label" htmlFor="availability">
              Stock status
            </label>
            <select id="availability" name="availability" defaultValue={product?.availability ?? "in_stock"} className="field sm:max-w-xs">
              <option value="in_stock">In stock</option>
              <option value="preorder">Pre-order (arriving in next shipment)</option>
              <option value="sold_out">Sold out</option>
            </select>
          </div>
          <Check name="published" label="Show on website" hint="Untick to hide it while you're still working on it." defaultChecked={product?.published ?? true} />
          <Check name="featured" label="Featured on homepage" defaultChecked={product?.featured ?? false} />
        </Card>

        {state?.error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}

        <div className="sticky bottom-0 -mx-4 flex gap-3 border-t border-line bg-[#f6f4ef]/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
          <button disabled={pending} className="btn-gold flex-1 py-3 text-base sm:flex-none sm:px-10">
            {pending ? "Saving…" : product ? "Save changes" : "Publish product"}
          </button>
          <Link href="/admin/products" className="btn-outline py-3">
            Cancel
          </Link>
        </div>
      </form>

      {product && (
        <form
          action={deleteProduct}
          className="mt-10 border-t border-line pt-6"
          onSubmit={(e) => {
            if (!confirm(`Delete “${product.name}”? This can't be undone.`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={product.id} />
          <button className="text-sm font-semibold text-red-600 hover:underline">Delete this product</button>
        </form>
      )}
    </>
  );
}

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div>
        <h2 className="font-display text-lg uppercase tracking-wide">{title}</h2>
        {hint && <p className="text-sm text-muted">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function MoneyField({
  name,
  label,
  hint,
  defaultValue,
  error,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultValue: string;
  error?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">GH₵</span>
        <input id={name} name={name} inputMode="decimal" defaultValue={defaultValue} className="field pl-12" placeholder="0.00" />
      </div>
      {hint && <p className="hint">{hint}</p>}
      <Err msg={error} />
    </div>
  );
}

function Check({ name, label, hint, defaultChecked }: { name: string; label: string; hint?: string; defaultChecked: boolean }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-5 w-5 accent-[#d4a537]" />
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

function Err({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1 text-xs font-medium text-red-600">{msg}</p> : null;
}
