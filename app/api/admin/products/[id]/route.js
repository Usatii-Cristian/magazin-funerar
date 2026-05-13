import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { slugify, generateUniqueSlugRaw, setSlugRaw } from "@/lib/slugify";
import { reportError } from "@/lib/errorTracking";
import { requireAdmin } from "@/lib/requireAdmin";

// Best-effort cleanup of Vercel Blob URLs that the product no longer
// references. Called from PUT (when admin removes images) and DELETE.
// Errors are swallowed so a missing/already-deleted blob doesn't break
// the user-visible operation.
async function deleteBlobs(urls) {
  const targets = (urls || []).filter(
    (u) => typeof u === "string" && u.includes(".public.blob.vercel-storage.com")
  );
  if (targets.length === 0) return;
  try {
    await del(targets);
  } catch (err) {
    console.error("Blob cleanup failed:", err.message);
  }
}

export async function GET(request, { params }) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const { id } = await params;
  try {
    const data = await request.json();

    if (!data.name || !data.category || !data.price) {
      return NextResponse.json(
        { error: "Lipsesc câmpurile: nume, categorie sau preț" },
        { status: 400 }
      );
    }
    const price = parseInt(data.price, 10);
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Preț invalid" }, { status: 400 });
    }
    let originalPrice = null;
    if (data.originalPrice !== null && data.originalPrice !== undefined && data.originalPrice !== "") {
      originalPrice = parseInt(data.originalPrice, 10);
      if (!Number.isFinite(originalPrice) || originalPrice < 0) {
        return NextResponse.json({ error: "Preț original invalid" }, { status: 400 });
      }
    }

    const newImages = Array.isArray(data.images)
      ? data.images.filter((u) => typeof u === "string")
      : [];

    // Snapshot the old images before update so we can drop the ones the
    // admin removed from Vercel Blob.
    const previous = await prisma.product.findUnique({
      where: { id },
      select: { images: true, slug: true },
    });
    const removedImages = (previous?.images ?? []).filter(
      (u) => !newImages.includes(u)
    );

    // Update product without slug (avoids stale-client issue)
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: String(data.name).slice(0, 200),
        category: String(data.category).slice(0, 100),
        material: String(data.material || "Granit").slice(0, 100),
        price,
        originalPrice,
        images: newImages,
        description: String(data.description || "").slice(0, 5000),
        dimensions: data.dimensions ? String(data.dimensions).slice(0, 200) : null,
        featured: Boolean(data.featured),
      },
    });

    // Fire-and-forget — don't block the response on Blob deletes.
    deleteBlobs(removedImages).catch(() => {});

    // Slug regeneration is non-blocking — update already succeeded
    let slug = slugify(data.name);
    try {
      slug = await generateUniqueSlugRaw(prisma, data.name, id);
      await setSlugRaw(prisma, id, slug);
    } catch (slugErr) {
      console.error("Slug regen failed (update saved):", slugErr.message);
    }

    revalidatePath("/");
    revalidatePath("/produse");
    revalidatePath(`/produse/${slug}`);

    return NextResponse.json({ ...product, slug });
  } catch (err) {
    await reportError("admin:product-update", err, { id });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAdmin();
  if (auth) return auth;
  const { id } = await params;
  try {
    // Read images + slug before delete so we can clean up Blob storage
    // and invalidate the canonical product page.
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { images: true, slug: true },
    });

    await prisma.product.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/produse");
    if (existing?.slug) revalidatePath(`/produse/${existing.slug}`);
    deleteBlobs(existing?.images).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (err) {
    await reportError("admin:product-delete", err, { id });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
