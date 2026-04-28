import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify, generateUniqueSlugRaw, setSlugRaw } from "@/lib/slugify";

export async function GET(request, { params }) {
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
  const { id } = await params;
  try {
    const data = await request.json();

    // Update product without slug (avoids stale-client issue)
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        material: data.material,
        price: parseInt(data.price),
        originalPrice: data.originalPrice ? parseInt(data.originalPrice) : null,
        images: data.images || [],
        description: data.description,
        dimensions: data.dimensions || null,
        featured: data.featured || false,
      },
    });

    // Slug regeneration is non-blocking — update already succeeded
    let slug = slugify(data.name);
    try {
      slug = await generateUniqueSlugRaw(prisma, data.name, id);
      await setSlugRaw(prisma, id, slug);
    } catch (slugErr) {
      console.error("Slug regen failed (update saved):", slugErr.message);
    }

    return NextResponse.json({ ...product, slug });
  } catch (err) {
    console.error("Product update failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
