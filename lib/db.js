import prisma from "./prisma";
import { products as staticProducts } from "./data";

function normalize(p) {
  const imgs = p.images?.length ? p.images : p.image ? [p.image] : [];
  return { ...p, images: imgs, image: imgs[0] ?? "" };
}

export async function getProducts() {
  try {
    const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    if (rows.length > 0) return rows.map(normalize);
  } catch {}
  return staticProducts.map(normalize);
}

export async function getProductById(id) {
  try {
    const p = await prisma.product.findUnique({ where: { id } });
    if (p) return normalize(p);
  } catch {}
  const sp = staticProducts.find((p) => p.id === id);
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
