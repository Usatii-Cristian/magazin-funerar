import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { products as staticProducts } from "@/lib/data";

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[ăâ]/g, "a")
    .replace(/[î]/g, "i")
    .replace(/[șş]/g, "s")
    .replace(/[țţ]/g, "t")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

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

    const usedSlugs = {};
    const data = staticProducts.map((p) => {
      let base = slugify(p.name);
      if (!base) base = "produs";
      let slug = base;
      if (usedSlugs[slug]) {
        usedSlugs[slug]++;
        slug = `${base}-${usedSlugs[slug]}`;
      } else {
        usedSlugs[slug] = 1;
      }
      return {
        name: p.name,
        slug,
        category: p.category || "Monumente Standart",
        material: p.material || "Granit",
        price: p.price,
        originalPrice: p.originalPrice || null,
        images: p.image ? [p.image] : [],
        description: p.description || "",
        dimensions: null,
        featured: p.featured || false,
      };
    });

    await prisma.product.createMany({ data });
    const productsSeeded = staticProducts.length;

    return NextResponse.json({ success: true, adminCreated, productsSeeded });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
