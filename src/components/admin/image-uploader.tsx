"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadImage } from "@/lib/upload-client";

export function ImageUploader({
  value,
  onChange,
  useBlob,
  max = 10,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  useBlob: boolean;
  max?: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const list = Array.from(files).slice(0, max - value.length);
    setBusy(list.length);
    let current = value;
    for (const f of list) {
      try {
        const url = await uploadImage(f, useBlob);
        current = [...current, url];
        onChange(current);
      } catch (e) {
        setError(`Couldn't upload ${f.name}: ${(e as Error).message}`);
      }
      setBusy((b) => b - 1);
    }
    if (input.current) input.current.value = "";
  }

  const move = (i: number, dir: -1 | 1) => {
    const next = [...value];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((url, i) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-sand">
            <Image src={url} alt="" fill sizes="160px" className="object-cover" />
            {i === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase text-gold-light">
                Main
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/70 to-transparent p-1.5">
              <div className="flex gap-1">
                <IconBtn label="Move left" onClick={() => move(i, -1)} disabled={i === 0}>
                  ←
                </IconBtn>
                <IconBtn label="Move right" onClick={() => move(i, 1)} disabled={i === value.length - 1}>
                  →
                </IconBtn>
              </div>
              <IconBtn label="Remove photo" onClick={() => onChange(value.filter((u) => u !== url))}>
                ✕
              </IconBtn>
            </div>
          </div>
        ))}
        {Array.from({ length: busy }).map((_, i) => (
          <div key={`busy-${i}`} className="grid aspect-square animate-pulse place-items-center rounded-xl bg-sand text-xs text-muted">
            Uploading…
          </div>
        ))}
        {value.length + busy < max && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-line bg-white text-center text-sm text-muted transition hover:border-gold hover:text-gold-dark"
          >
            <span>
              <span className="block text-3xl leading-none">+</span>
              Add photos
            </span>
          </button>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-xs font-bold text-ink disabled:opacity-30"
    >
      {children}
    </button>
  );
}
