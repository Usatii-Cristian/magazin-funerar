import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Blog — Sfaturi și Tradiții Funerare",
  description:
    "Articole despre monumente funerare, alegerea materialelor, organizarea serviciilor de înmormântare și tradiții funerare din Republica Moldova.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog PrimNord Granit — Sfaturi și Tradiții Funerare",
    description:
      "Articole despre monumente funerare, alegerea materialelor și tradiții funerare din Moldova.",
    url: "/blog",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let posts = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    posts = [];
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-stone-950 py-16 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold-400">
          Resurse și sfaturi
        </p>
        <h1 className="font-display text-4xl font-semibold text-white">Blog</h1>
        <p className="mx-auto mt-3 max-w-xl text-stone-400">
          Articole despre monumente funerare, tradiții și servicii de înmormântare
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14">
        {posts.length === 0 ? (
          <p className="text-center text-stone-500">Nu există articole publicate momentan.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-100 transition-shadow hover:shadow-md"
              >
                {/* Cover */}
                <div className="relative h-48 overflow-hidden bg-stone-200">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-stone-800">
                      <svg className="h-12 w-12 text-stone-600" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="mb-2 text-xs font-medium text-stone-400">
                    {new Date(post.createdAt).toLocaleDateString("ro-RO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <h2 className="font-display text-lg font-semibold text-stone-900 transition-colors group-hover:text-gold-600 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm leading-relaxed text-stone-500 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold-600">
                    Citește mai mult
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
