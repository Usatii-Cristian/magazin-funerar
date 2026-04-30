import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let post = null;
  try {
    post = await prisma.blogPost.findUnique({ where: { slug } });
  } catch {}
  if (!post) return { title: "Articol negăsit" };
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: url },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt || undefined,
      url,
      type: "article",
      publishedTime: post.createdAt?.toISOString?.() || undefined,
      modifiedTime: post.updatedAt?.toISOString?.() || undefined,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  let post = null;
  try {
    post = await prisma.blogPost.findUnique({ where: { slug } });
  } catch {}

  if (!post || !post.published) notFound();

  const articleUrl = `${SITE_URL}/blog/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.coverImage || undefined,
    datePublished: post.createdAt?.toISOString?.() || undefined,
    dateModified: post.updatedAt?.toISOString?.() || undefined,
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    inLanguage: "ro-RO",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Acasă", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: articleUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Cover image */}
      {post.coverImage && (
        <div className="relative h-64 w-full overflow-hidden bg-stone-900 sm:h-80 lg:h-96">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover opacity-70"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Back */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-800"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Înapoi la blog
        </Link>

        {/* Meta */}
        <p className="text-xs font-medium uppercase tracking-widest text-gold-500">
          {new Date(post.createdAt).toLocaleDateString("ro-RO", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-stone-500">{post.excerpt}</p>
        )}

        <hr className="my-8 border-stone-200" />

        {/* Article body */}
        <article
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <hr className="my-10 border-stone-200" />

        {/* CTA */}
        <div className="rounded-2xl bg-stone-900 p-8 text-center">
          <h3 className="font-display text-xl font-semibold text-white">
            Aveți nevoie de ajutor?
          </h3>
          <p className="mt-2 text-stone-400">
            Echipa PrimNord Granit vă stă la dispoziție pentru orice întrebare.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-block rounded-lg bg-gold-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-600"
          >
            Contactați-ne
          </Link>
        </div>
      </div>
    </div>
  );
}
