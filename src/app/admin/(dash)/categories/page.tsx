import { adminCategoriesWithCounts } from "@/lib/data";
import { deleteCategory, updateCategory } from "../../actions";
import { NewCategoryForm } from "@/components/admin/new-category-form";
import { ConfirmButton } from "@/components/admin/confirm-button";

export default async function CategoriesPage() {
  const cats = await adminCategoriesWithCounts();
  return (
    <>
      <h1 className="font-display text-3xl uppercase tracking-wide">Categories</h1>
      <p className="text-sm text-muted">
        Group your products so customers can find them. Only categories with products are shown on the website. Lower numbers appear first.
      </p>

      <div className="mt-6">
        <NewCategoryForm />
      </div>

      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {cats.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-2 p-3 sm:p-4">
            <form action={updateCategory} className="flex flex-1 flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={c.id} />
              <input name="sortOrder" defaultValue={c.sortOrder} inputMode="numeric" aria-label="Order" className="field w-16 text-center" />
              <input name="name" defaultValue={c.name} aria-label="Category name" className="field min-w-40 flex-1" />
              <span className="w-24 text-xs text-muted">{c.count} product{c.count === 1 ? "" : "s"}</span>
              <button className="btn-outline px-4 py-2">Save</button>
            </form>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c.id} />
              <ConfirmButton
                message={
                  c.count
                    ? `Delete “${c.name}”? Its ${c.count} product(s) will be kept but have no category.`
                    : `Delete “${c.name}”?`
                }
                className="px-2 py-2 text-sm font-semibold text-red-600 hover:underline"
              >
                Delete
              </ConfirmButton>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
