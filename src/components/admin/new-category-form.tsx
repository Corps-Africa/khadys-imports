"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCategory } from "@/app/admin/actions";

export function NewCategoryForm() {
  const [state, action, pending] = useActionState(createCategory, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} action={action} className="flex flex-wrap gap-2 rounded-2xl border border-line bg-white p-4">
      <input name="name" placeholder="New category name, e.g. Wigs & Hair" className="field min-w-48 flex-1" required />
      <button disabled={pending} className="btn-gold">
        {pending ? "Adding…" : "+ Add category"}
      </button>
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
