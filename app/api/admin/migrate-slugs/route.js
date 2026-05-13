import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify, setSlugRaw } from "@/lib/slugify";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST() {
  const auth = await requireAdmin();
  if (auth) return auth;
  try {
    const result = await prisma.$runCommandRaw({
      find: "Product",
      filter: {},
      projection: { _id: 1, name: 1, slug: 1 },
      batchSize: 1000,
    });

    const products = result?.cursor?.firstBatch ?? [];
    const withoutSlugs = products.filter((p) => !p.slug);

    if (withoutSlugs.length === 0) {
      return NextResponse.json({ success: true, updated: 0 });
    }

    const existingSlugs = new Set(
      products.map((p) => p.slug).filter(Boolean)
    );

    for (const product of withoutSlugs) {
      const id = product._id?.$oid ?? product._id;
      let base = slugify(product.name) || "produs";
      let slug = base;
      let counter = 1;
      while (existingSlugs.has(slug)) slug = `${base}-${++counter}`;
      existingSlugs.add(slug);
      await setSlugRaw(prisma, id, slug);
    }

    return NextResponse.json({ success: true, updated: withoutSlugs.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
