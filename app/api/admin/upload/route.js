import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images");

    const urls = [];
    for (const file of files) {
      if (!(file instanceof File)) continue;
      const ext = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "");
      const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const blob = await put(filename, file, { access: "public" });
      urls.push(blob.url);
    }

    return NextResponse.json({ urls });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
