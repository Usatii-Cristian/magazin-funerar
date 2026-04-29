import { NextResponse } from "next/server";
import { handleUpload } from "@vercel/blob/client";
import { reportError } from "@/lib/errorTracking";

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
        addRandomSuffix: true,
        maximumSizeInBytes: 15 * 1024 * 1024,
      }),
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    await reportError("admin:upload-token", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
