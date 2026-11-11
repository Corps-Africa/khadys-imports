"use client";

import { upload } from "@vercel/blob/client";

/** Shrinks phone photos (often 4–8 MB) to a web-friendly JPEG/WebP before upload. */
async function compress(file: File, maxSide = 1600, quality = 0.82): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const type = file.type === "image/png" ? "image/webp" : "image/jpeg";
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, type, quality));
    if (!blob || blob.size >= file.size) return file;
    const base = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${base}.${type === "image/webp" ? "webp" : "jpg"}`, { type });
  } catch {
    return file;
  }
}

export async function uploadImage(original: File, useBlob: boolean): Promise<string> {
  const file = await compress(original);
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  if (useBlob) {
    const res = await upload(`products/${safeName}`, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });
    return res.url;
  }
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload-local", { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Upload failed");
  return json.url;
}
