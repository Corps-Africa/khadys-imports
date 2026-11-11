"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductImage } from "./product-card";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-sand">
        <ProductImage src={images[active]} alt={name} priority sizes="(min-width:768px) 540px, 100vw" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                i === active ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Show photo ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
