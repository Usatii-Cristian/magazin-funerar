import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images");

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const urls = [];
    for (const file of files) {
      if (!(file instanceof File)) continue;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "");
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      await writeFile(path.join(uploadDir, filename), buffer);
      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
