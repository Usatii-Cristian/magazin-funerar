import { cache } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductById, getSimilarProducts } from "@/lib/db";
import { products as staticProducts } from "@/lib/data";
import { slugify } from "@/lib/slugify";
import { SITE_URL, SITE_NAME, ORG_PHONE } from "@/lib/site";
import ImageGallery from "./ImageGallery";

export const revalidate = 60;

const getCachedProduct = cache(getProductById);

export async function generateStaticParams() {
  return staticProducts.map((p) => ({ id: slugify(p.name) }));
}

const categoryBadge = {
  "Monumente Standart": "bg-stone-100 text-stone-700",
  "Monumente Duble": "bg-blue-100 text-blue-700",
  "Monumente Vip": "bg-amber-100 text-amber-700",
  "Monumente Copii": "bg-pink-100 text-pink-700",
  "Monumente Complex": "bg-purple-100 text-purple-700",
  "Monumente Gri": "bg-slate-100 text-slate-700",
  "Monumente Beton Armat": "bg-zinc-100 text-zinc-700",
  "Accesorii Monumente": "bg-emerald-100 text-emerald-700",
  "Garduri Morminte": "bg-teal-100 text-teal-700",
  "Mese si Scaune": "bg-cyan-100 text-cyan-700",
  "Scari si Pervazuri": "bg-indigo-100 text-indigo-700",
  Cruci: "bg-red-100 text-red-700",
  Sicrie: "bg-neutral-200 text-neutral-700",
  Coroane: "bg-green-100 text-green-700",
  "Fundatii din Granit": "bg-orange-100 text-orange-700",
  "Fundatii din Beton Armat": "bg-yellow-100 text-yellow-700",
};

function formatPrice(n) {
  return n.toLocaleString("ro-RO") + " lei";
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getCachedProduct(id);
  if (!product) return { title: "Produs negăsit" };
  const slug = product.slug || product.id;
  const url = `/produse/${slug}`;
  const desc = (product.description || "").slice(0, 160);
  return {
    title: product.name,
    description: desc || `${product.name} — ${product.material}, ${product.category}.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description: desc,
      url,
      type: "website",
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: desc,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getCachedProduct(id);

  if (!product) notFound();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const similar = await getSimilarProducts(product.category, product.id);
  const badgeClass = categoryBadge[product.category] ?? "bg-stone-100 text-stone-700";

  const slug = product.slug || product.id;
  const productUrl = `${SITE_URL}/produse/${slug}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: product.description,
    sku: product.id,
    image: (product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : []
    ).filter(Boolean),
    category: product.category,
    material: product.material,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "MDL",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Acasă", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Monumente Funerare", item: `${SITE_URL}/produse` },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category,
        item: `${SITE_URL}/produse?categoria=${encodeURIComponent(product.category)}`,
      },
      { "@type": "ListItem", position: 4, name: product.name, item: productUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* ── Hero image with lightbox ─────────────────────────── */}
      <ImageGallery images={product.images} name={product.name}>
        {/* Back link */}
        <div className="absolute left-6 top-6">
          <Link
            href="/produse"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Înapoi
          </Link>
        </div>

        {/* Title area */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                {product.category}
              </span>
              {discount && (
                <span className="rounded bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
                  -{discount}%
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl [overflow-wrap:anywhere]">
              {product.name}
            </h1>
            <p className="mt-2 text-base font-medium uppercase tracking-widest text-gold-400 [overflow-wrap:anywhere]">
              {product.material}
            </p>
          </div>
        </div>
      </ImageGallery>

      {/* ── Breadcrumb ────────────────────────────────────────── */}
      <nav className="border-b border-stone-100 bg-white px-6 py-3 text-sm text-stone-500">
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          <Link href="/" className="transition-colors hover:text-gold-600">Acasă</Link>
          <span>/</span>
          <Link href="/produse" className="transition-colors hover:text-gold-600">Monumente Funerare</Link>
          <span>/</span>
          <Link
            href={`/produse?categoria=${encodeURIComponent(product.category)}`}
            className="transition-colors hover:text-gold-600"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="max-w-[200px] truncate text-stone-800">{product.name}</span>
        </div>
      </nav>

      {/* ── Product details ───────────────────────────────────── */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">

            {/* Description + gallery */}
            <div className="min-w-0">
              <h2 className="mb-4 font-display text-2xl font-semibold text-stone-900">
                Descriere produs
              </h2>
              <p className="text-base leading-relaxed text-stone-600 [overflow-wrap:anywhere]">
                {product.description}
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Material", value: product.material },
                  { label: "Categorie", value: product.category },
                  ...(product.dimensions
                    ? [{ label: "Dimensiuni", value: product.dimensions }]
                    : []),
                  { label: "Montaj", value: "Inclus în preț" },
                  { label: "Garanție", value: "Lucrare garantată" },
                ].map((item) => (
                  <div key={item.label} className="min-w-0 overflow-hidden rounded-lg bg-cream-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      {item.label}
                    </p>
                    <p className="mt-1 font-medium text-stone-800 [overflow-wrap:anywhere]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price / CTA */}
            <div className="min-w-0 self-start lg:sticky lg:top-24">
              <div className="rounded-2xl border border-stone-100 bg-cream-50 p-8 shadow-sm">
                {/* Price */}
                <div className="mb-6 border-b border-stone-200 pb-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
                    Preț de pornire
                  </p>
                  <div className="flex flex-wrap items-end gap-3">
                    <span className="font-display text-4xl font-semibold text-stone-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="mb-1 text-lg text-stone-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <p className="mt-2 text-sm font-medium text-emerald-600">
                      Economisiți {formatPrice(product.originalPrice - product.price)}
                    </p>
                  )}
                </div>

                {/* Info points */}
                <ul className="mb-6 space-y-2.5 text-sm text-stone-600">
                  {[
                    "Gravură personalizată inclusă",
                    "Montaj profesionist inclus",
                    "Consultanță gratuită",
                    "Disponibil la comandă",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <svg className="h-4 w-4 shrink-0 text-gold-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Equal CTA buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/contact"
                    className="rounded-lg bg-gold-500 py-4 text-center text-sm font-semibold text-white transition-colors hover:bg-gold-600"
                  >
                    Ofertă
                  </Link>
                  <a
                    href="tel:079175383"
                    className="flex items-center justify-center gap-1.5 rounded-lg border-2 border-stone-200 py-4 text-sm font-semibold text-stone-800 transition-colors hover:border-stone-400"
                  >
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    Sunați
                  </a>
                </div>
                <p className="mt-3 text-center text-xs text-stone-400">079 175 383</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Similar products ──────────────────────────────────── */}
      {similar.length > 0 && (
        <section className="bg-cream-50 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 font-display text-2xl font-semibold text-stone-900">
              Produse similare din categoria{" "}
              <span className="text-gold-600">{product.category}</span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => {
                const pct = p.originalPrice
                  ? Math.round((1 - p.price / p.originalPrice) * 100)
                  : null;
                return (
                  <Link
                    key={p.id}
                    href={`/produse/${p.slug || p.id}`}
                    className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-100 transition-shadow hover:shadow-lg"
                  >
                    <div className="relative h-52 overflow-hidden bg-stone-100">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized={p.image.startsWith("/uploads/")}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-stone-300">
                          <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M4.5 3h15A1.5 1.5 0 0121 4.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15A1.5 1.5 0 014.5 3z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-stone-900/25" />
                      <div className="absolute left-3 top-3 flex gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryBadge[p.category] ?? "bg-stone-100 text-stone-700"}`}>
                          {p.category}
                        </span>
                        {pct && (
                          <span className="rounded bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                            -{pct}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-medium uppercase tracking-wider text-gold-500">
                        {p.material}
                      </p>
                      <h3 className="mt-1 line-clamp-2 break-words font-display text-base font-semibold text-stone-900 transition-colors group-hover:text-gold-600">
                        {p.name}
                      </h3>
                      <p className="mt-2 line-clamp-2 break-words text-sm leading-relaxed text-stone-500">
                        {p.description}
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="font-display text-lg font-semibold text-stone-900">
                          {formatPrice(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-sm text-stone-400 line-through">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-xs font-medium text-gold-600 underline-offset-2 group-hover:underline">
                        Vezi detalii →
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-10 text-center">
              <Link
                href={`/produse?categoria=${encodeURIComponent(product.category)}`}
                className="inline-flex items-center gap-2 rounded border border-stone-300 px-6 py-3 text-sm text-stone-700 transition-colors hover:border-stone-500"
              >
                Vezi toate produsele din {product.category}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
