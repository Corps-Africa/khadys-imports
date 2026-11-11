import Link from "next/link";
import { adminCategoriesWithCounts } from "@/lib/data";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await adminCategoriesWithCounts();
  return (
    <>
      <Link href="/admin/products" className="text-sm text-muted hover:text-ink">
        ← Products
      </Link>
      <h1 className="mb-6 mt-1 font-display text-3xl uppercase tracking-wide">Add a product</h1>
      <ProductForm categories={categories} useBlob={!!process.env.BLOB_READ_WRITE_TOKEN} />
    </>
  );
}
