export function slugify(name) {
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

// Uses $runCommandRaw to bypass stale Prisma client (works even without prisma generate)
export async function generateUniqueSlugRaw(prisma, name, excludeId = null) {
  const base = slugify(name) || "produs";

  const result = await prisma.$runCommandRaw({
    find: "Product",
    filter: { slug: { $exists: true, $ne: null } },
    projection: { _id: 1, slug: 1 },
    batchSize: 1000,
  });

  const existingSlugs = new Set(
    (result?.cursor?.firstBatch ?? [])
      .filter((p) => {
        const id = p._id?.$oid ?? p._id;
        return id !== excludeId;
      })
      .map((p) => p.slug)
      .filter(Boolean)
  );

  let slug = base;
  let counter = 1;
  while (existingSlugs.has(slug)) slug = `${base}-${++counter}`;
  return slug;
}

export async function setSlugRaw(prisma, id, slug) {
  await prisma.$runCommandRaw({
    update: "Product",
    updates: [{ q: { _id: { $oid: id } }, u: { $set: { slug } } }],
  });
}
