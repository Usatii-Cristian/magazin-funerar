import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { slugify, generateUniqueSlugRaw, setSlugRaw } from "@/lib/slugify";
import { reportError } from "@/lib/errorTracking";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const auth = await requireAdmin();
  if (auth) return auth;
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth) return auth;
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

    const product = await prisma.product.create({
      data: {
        name: String(data.name).slice(0, 200),
        category: String(data.category).slice(0, 100),
        material: (data.material || "Granit").slice(0, 100),
        price,
        originalPrice,
        images: Array.isArray(data.images) ? data.images.filter((u) => typeof u === "string") : [],
        description: String(data.description || "").slice(0, 5000),
        dimensions: data.dimensions ? String(data.dimensions).slice(0, 200) : null,
        featured: Boolean(data.featured),
      },
    });

    // Slug generation must NOT fail the request — product is already saved
    let slug = slugify(data.name);
    try {
      slug = await generateUniqueSlugRaw(prisma, data.name, product.id);
      await setSlugRaw(prisma, product.id, slug);
    } catch (slugErr) {
      console.error("Slug generation failed (product saved):", slugErr.message);
    }

    revalidatePath("/");
    revalidatePath("/produse");
    revalidatePath(`/produse/${slug}`);

    return NextResponse.json({ ...product, slug }, { status: 201 });
  } catch (err) {
    await reportError("admin:product-create", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
