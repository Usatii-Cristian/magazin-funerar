import prisma from "./prisma";
import { products as staticProducts } from "./data";
import { slugify, generateUniqueSlugRaw, setSlugRaw } from "./slugify";

function normalize(p) {
  const imgs = p.images?.length ? p.images : p.image ? [p.image] : [];
  const slug = p.slug || slugify(p.name || "produs");
  return {
    ...p,
    name: p.name ?? "Produs",
    category: p.category ?? "Necategorizat",
    material: p.material ?? "Granit",
    description: p.description ?? "",
    price: typeof p.price === "number" ? p.price : 0,
    images: imgs,
    image: imgs[0] ?? "",
    slug,
  };
}

// Fix legacy/dirty data (null/missing required fields) so Prisma findMany doesn't blow up
export async function fixProductIntegrity() {
  const now = { $date: new Date().toISOString() };
  try {
    await prisma.$runCommandRaw({
      update: "Product",
      updates: [
        { q: { category: null }, u: { $set: { category: "Necategorizat" } }, multi: true },
        { q: { category: { $exists: false } }, u: { $set: { category: "Necategorizat" } }, multi: true },
        { q: { material: null }, u: { $set: { material: "Granit" } }, multi: true },
        { q: { material: { $exists: false } }, u: { $set: { material: "Granit" } }, multi: true },
        { q: { description: null }, u: { $set: { description: "" } }, multi: true },
        { q: { description: { $exists: false } }, u: { $set: { description: "" } }, multi: true },
        { q: { name: null }, u: { $set: { name: "Produs" } }, multi: true },
        { q: { name: { $exists: false } }, u: { $set: { name: "Produs" } }, multi: true },
        { q: { images: null }, u: { $set: { images: [] } }, multi: true },
        { q: { images: { $exists: false } }, u: { $set: { images: [] } }, multi: true },
        { q: { price: null }, u: { $set: { price: 0 } }, multi: true },
        { q: { price: { $exists: false } }, u: { $set: { price: 0 } }, multi: true },
        { q: { featured: null }, u: { $set: { featured: false } }, multi: true },
        { q: { featured: { $exists: false } }, u: { $set: { featured: false } }, multi: true },
        { q: { createdAt: null }, u: { $set: { createdAt: now } }, multi: true },
        { q: { createdAt: { $exists: false } }, u: { $set: { createdAt: now } }, multi: true },
        { q: { updatedAt: null }, u: { $set: { updatedAt: now } }, multi: true },
        { q: { updatedAt: { $exists: false } }, u: { $set: { updatedAt: now } }, multi: true },
      ],
    });
  } catch {}
}

async function findManyResilient() {
  try {
    return await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    await fixProductIntegrity();
    return await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  }
}

export async function getProducts() {
  try {
    const rows = await findManyResilient();
    const dbIds = new Set(rows.map((r) => r.id));
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
  const sp = staticProducts.find(
    (p) => p.id === idOrSlug || slugify(p.name) === idOrSlug
  );
  return sp ? normalize(sp) : null;
}

export async function getFeaturedProducts() {
  async function fetchFeatured() {
    return await prisma.product.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  }
  try {
    let rows;
    try {
      rows = await fetchFeatured();
    } catch {
      await fixProductIntegrity();
      rows = await fetchFeatured();
    }
    if (rows.length > 0) return rows.map(normalize);
  } catch {}
  return staticProducts.filter((p) => p.featured).map(normalize);
}

export async function getSimilarProducts(category, excludeId) {
  async function fetchByCategory() {
    return await prisma.product.findMany({ where: { category } });
  }
  try {
    let rows;
    try {
      rows = await fetchByCategory();
    } catch {
      await fixProductIntegrity();
      rows = await fetchByCategory();
    }
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
