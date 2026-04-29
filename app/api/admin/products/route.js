import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { slugify, generateUniqueSlugRaw, setSlugRaw } from "@/lib/slugify";
import { reportError } from "@/lib/errorTracking";

export async function GET() {
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
  try {
    const data = await request.json();

    if (!data.name || !data.category || !data.price) {
      return NextResponse.json(
        { error: "Lipsesc câmpurile: nume, categorie sau preț" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        material: data.material || "Granit",
        price: parseInt(data.price),
        originalPrice: data.originalPrice ? parseInt(data.originalPrice) : null,
        images: Array.isArray(data.images) ? data.images : [],
        description: data.description || "",
        dimensions: data.dimensions || null,
        featured: data.featured || false,
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
