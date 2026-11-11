import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { isAdmin } from "@/lib/auth";

/**
 * Development-only fallback when BLOB_READ_WRITE_TOKEN isn't set:
 * saves uploads into ./.uploads (served by /media/[name]). Disabled in production because
 * Vercel's filesystem is read-only.
 */
export async function POST(request: Request) {
  if (process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL) {
    return NextResponse.json({ error: "Local uploads are disabled" }, { status: 404 });
  }
  if (!(await isAdmin())) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Please choose an image" }, { status: 400 });
  }
  const ext = (file.name.split(".").pop() || "jpg").replace(/[^a-z0-9]/gi, "").toLowerCase();
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), ".uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/media/${name}` });
}
