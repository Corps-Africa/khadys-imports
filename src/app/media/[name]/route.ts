import { readFile } from "node:fs/promises";
import path from "node:path";

/** Serves images uploaded in local development (see /api/upload-local). Not used on Vercel. */
const TYPES: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };

export async function GET(_req: Request, ctx: RouteContext<"/media/[name]">) {
  const { name } = await ctx.params;
  if (!/^[\w.-]+$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(path.join(process.cwd(), ".uploads", name));
    const ext = name.split(".").pop()!.toLowerCase();
    return new Response(data, {
      headers: { "Content-Type": TYPES[ext] ?? "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
