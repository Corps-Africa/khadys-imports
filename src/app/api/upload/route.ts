import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

/**
 * Issues short-lived upload tokens so the admin's browser can send product
 * photos straight to Vercel Blob (this avoids Vercel's 4.5 MB request limit).
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!(await isAdmin())) throw new Error("Not signed in");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
