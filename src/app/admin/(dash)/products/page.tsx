import Image from "next/image";
import Link from "next/link";
import { adminListProducts } from "@/lib/data";
import { formatCedi } from "@/lib/format";
import { toggleProduct } from "../../actions";
import { ProductSearch } from "@/components/admin/product-search";

export default async function AdminProducts(props: PageProps<"/admin/products">) {
  const sp = await props.searchParams;
  const q = typeof sp.q === "string" ? sp.q.toLowerCase() : "";
  const saved = typeof sp.saved === "string" ? sp.saved : "";
  const deleted = sp.deleted === "1";
  const all = await adminListProducts();
  const list = q ? all.filter((p) => p.name.toLowerCase().includes(q)) : all;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide">Products</h1>
          <p className="text-sm text-muted">{all.length} total</p>
        </div>
        <Link href="/admin/products/new" className="btn-gold">
          + Add product
        </Link>
      </div>

      {saved && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ✓ “{saved}” was saved and is up to date on the website.
        </p>
      )}
      {deleted && <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">✓ Product deleted.</p>}

      <div className="mt-5">
        <ProductSearch defaultValue={q} />
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-white p-10 text-center text-muted">
          {q ? "No products match your search." : "No products yet. Add your first one!"}
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {list.map((p) => (
            <li key={p.id} className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
              <Link href={`/admin/products/${p.id}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-sand">
                {p.images[0] && <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" />}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/products/${p.id}`} className="line-clamp-1 font-semibold hover:text-gold-dark">
                  {p.name}
                </Link>
                <p className="text-sm text-muted">
                  {p.price !== null ? formatCedi(p.price) : "Ask for price"}
                  {p.categoryName ? ` · ${p.categoryName}` : ""}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Toggle id={p.id} field="published" on={p.published} onLabel="On site" offLabel="Hidden" />
                  <Toggle id={p.id} field="featured" on={p.featured} onLabel="★ Featured" offLabel="☆ Feature" />
                  <Toggle id={p.id} field="sold_out" on={p.availability !== "sold_out"} onLabel={p.availability === "preorder" ? "Pre-order" : "In stock"} offLabel="Sold out" />
                </div>
              </div>
              <Link href={`/admin/products/${p.id}`} className="btn-outline hidden px-4 py-2 sm:inline-flex">
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Toggle({ id, field, on, onLabel, offLabel }: { id: number; field: string; on: boolean; onLabel: string; offLabel: string }) {
  return (
    <form action={toggleProduct}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <button
        title="Tap to change"
        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 transition ${
          on ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-neutral-100 text-neutral-500 ring-neutral-200"
        }`}
      >
        {on ? onLabel : offLabel}
      </button>
    </form>
  );
}
