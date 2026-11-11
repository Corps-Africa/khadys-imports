"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProductSearch({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);
  useEffect(() => {
    const t = setTimeout(() => {
      if (q !== defaultValue) router.replace(q ? `/admin/products?q=${encodeURIComponent(q)}` : "/admin/products");
    }, 300);
    return () => clearTimeout(t);
  }, [q, defaultValue, router]);
  return <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search your products…" className="field" />;
}
