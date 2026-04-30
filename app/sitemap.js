import prisma from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();

  const staticEntries = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/servicii`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/produse`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/despre`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
  ];

  let products = [];
  let posts = [];
  try {
    [products, posts] = await Promise.all([
      prisma.product.findMany({
        select: { slug: true, id: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);
  } catch {
    // DB unreachable — still return static entries so the sitemap isn't empty
  }

  const productEntries = products.map((p) => ({
    url: `${SITE_URL}/produse/${p.slug || p.id}`,
    lastModified: p.updatedAt || now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogEntries = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt || now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...blogEntries];
}
