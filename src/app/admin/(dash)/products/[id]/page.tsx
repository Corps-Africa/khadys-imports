import Link from "next/link";
import { notFound } from "next/navigation";
import { adminCategoriesWithCounts, adminGetProduct } from "@/lib/data";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage(props: PageProps<"/admin/products/[id]">) {
  const { id } = await props.params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();
  const [product, categories] = await Promise.all([adminGetProduct(productId), adminCategoriesWithCounts()]);
  if (!product) notFound();

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/products" className="text-sm text-muted hover:text-ink">
          ← Products
        </Link>
        {product.published && (
          <Link href={`/products/${product.slug}`} target="_blank" className="text-sm text-gold-dark underline">
            View on site ↗
          </Link>
        )}
      </div>
      <h1 className="mb-6 mt-1 font-display text-3xl uppercase tracking-wide">Edit product</h1>
      <ProductForm product={product} categories={categories} useBlob={!!process.env.BLOB_READ_WRITE_TOKEN} />
    </>
  );
}
