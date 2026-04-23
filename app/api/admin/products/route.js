import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
