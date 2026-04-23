import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { products as staticProducts } from "@/lib/data";

export async function POST() {
  try {
    let adminCreated = false;
    const existing = await prisma.admin.findUnique({
      where: { email: "cristiusa98@gmail.com" },
    });
    if (!existing) {
      const passwordHash = await bcrypt.hash("smecherul1", 12);
      await prisma.admin.create({
        data: { email: "cristiusa98@gmail.com", passwordHash },
      });
      adminCreated = true;
    }

    // Always reseed: delete old records and import fresh
    await prisma.product.deleteMany({});
    await prisma.product.createMany({
      data: staticProducts.map((p) => ({
        name: p.name,
        category: p.category || "Monumente Standart",
        material: p.material || "Granit",
        price: p.price,
        originalPrice: p.originalPrice || null,
        images: p.image ? [p.image] : [],
        description: p.description || "",
        dimensions: null,
        featured: p.featured || false,
      })),
    });
    const productsSeeded = staticProducts.length;

    return NextResponse.json({
      success: true,
      adminCreated,
      productsSeeded,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
