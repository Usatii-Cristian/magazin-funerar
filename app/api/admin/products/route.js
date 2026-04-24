import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateUniqueSlugRaw, setSlugRaw } from "@/lib/slugify";

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

    // Create product without slug (avoids stale-client issue)
    const product = await prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        material: data.material || "Granit",
        price: parseInt(data.price),
        originalPrice: data.originalPrice ? parseInt(data.originalPrice) : null,
        images: data.images || [],
        description: data.description,
        dimensions: data.dimensions || null,
        featured: data.featured || false,
      },
    });

    // Set slug via raw command — bypasses stale Prisma client
    const slug = await generateUniqueSlugRaw(prisma, data.name, product.id);
    await setSlugRaw(prisma, product.id, slug);

    return NextResponse.json({ ...product, slug }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
