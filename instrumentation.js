export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const { default: prisma } = await import("./lib/prisma.js");
    const { slugify, setSlugRaw } = await import("./lib/slugify.js");

    // $runCommandRaw bypasses stale Prisma client — works even without prisma generate
    const result = await prisma.$runCommandRaw({
      find: "Product",
      filter: { $or: [{ slug: { $exists: false } }, { slug: null }] },
      projection: { _id: 1, name: 1 },
      batchSize: 1000,
    });

    const withoutSlugs = result?.cursor?.firstBatch ?? [];
    if (withoutSlugs.length === 0) return;

    const allResult = await prisma.$runCommandRaw({
      find: "Product",
      filter: { slug: { $exists: true, $ne: null } },
      projection: { slug: 1 },
      batchSize: 1000,
    });
    const existingSlugs = new Set(
      (allResult?.cursor?.firstBatch ?? []).map((p) => p.slug).filter(Boolean)
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
    console.log(`[PrimNord] Generat slug-uri pentru ${withoutSlugs.length} produse`);
  } catch (e) {
    console.error("[PrimNord] Eroare sluguri:", e.message);
  }
}
