"use client";

const MAX_DIM = 1600;
const QUALITY = 0.82;

export async function optimizeImage(file, { maxDim = MAX_DIM, quality = QUALITY } = {}) {
  if (!file.type.startsWith("image/")) return file;
  if (file.type === "image/gif" || file.type === "image/svg+xml") return file;

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const { width, height } = bitmap;
  const scale = Math.min(1, maxDim / Math.max(width, height));
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality)
  );
  if (!blob) return file;

  if (blob.size >= file.size && scale === 1) return file;

  const baseName = file.name.replace(/\.[^.]+$/, "") || "img";
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}
