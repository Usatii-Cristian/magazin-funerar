import prisma from "./prisma";
import { products as staticProducts } from "./data";
import { generateUniqueSlugRaw, setSlugRaw } from "./slugify";

function normalize(p) {
  const imgs = p.images?.length ? p.images : p.image ? [p.image] : [];
  return { ...p, images: imgs, image: imgs[0] ?? "" };
}

export async function getProducts() {
  try {
    const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    const dbIds = new Set(rows.map((r) => r.id));
    // Always show static products alongside DB ones (DB first)
    const staticOnly = staticProducts.filter((p) => !dbIds.has(p.id));
    return [...rows, ...staticOnly].map(normalize);
  } catch {}
  return staticProducts.map(normalize);
}

export async function getProductById(idOrSlug) {
  try {
    if (/^[a-f0-9]{24}$/.test(idOrSlug)) {
      const p = await prisma.product.findUnique({ where: { id: idOrSlug } });
      if (p) {
        if (!p.slug) {
          const slug = await generateUniqueSlugRaw(prisma, p.name, p.id);
          await setSlugRaw(prisma, p.id, slug);
          return normalize({ ...p, slug });
        }
        return normalize(p);
      }
    }

    // Try Prisma slug lookup
    try {
      const p = await prisma.product.findFirst({ where: { slug: idOrSlug } });
      if (p) return normalize(p);
    } catch {
      // Fallback: raw MongoDB command (works with stale client too)
      const result = await prisma.$runCommandRaw({
        find: "Product",
        filter: { slug: idOrSlug },
        limit: 1,
      });
      const doc = result?.cursor?.firstBatch?.[0];
      if (doc) {
        const id = doc._id?.$oid ?? doc._id;
        return normalize({ ...doc, id });
      }
    }
  } catch {}
  const sp = staticProducts.find((p) => p.id === idOrSlug);
  return sp ? normalize(sp) : null;
}

export async function getFeaturedProducts() {
  try {
    const rows = await prisma.product.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    if (rows.length > 0) return rows.map(normalize);
  } catch {}
  return staticProducts.filter((p) => p.featured).map(normalize);
}

export async function getSimilarProducts(category, excludeId) {
  try {
    const rows = await prisma.product.findMany({ where: { category } });
    return rows
      .filter((p) => p.id !== excludeId)
      .slice(0, 3)
      .map(normalize);
  } catch {}
  return staticProducts
    .filter((p) => p.category === category && p.id !== excludeId)
    .slice(0, 3)
    .map(normalize);
}
