import Link from "next/link";
import Image from "next/image";
import { services, categories, companyInfo, testimonials } from "@/lib/data";
import { getFeaturedProducts, getProducts } from "@/lib/db";
import QuickQuote from "@/components/QuickQuote";

export const revalidate = 60;

function ServiceIcon({ icon }) {
  if (icon === "ceremony")
    return (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.7.7m13.86 13.86.7.7M1 12h1m20 0h1M4.22 19.78l.7-.7m13.86-13.86.7-.7M12 6a6 6 0 100 12A6 6 0 0012 6z" />
      </svg>
    );
  if (icon === "transport")
    return (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    );
  if (icon === "monument")
    return (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L8 7H5v14h14V7h-3L12 2zM9 21v-6h6v6" />
      </svg>
    );
  return (
    <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  );
}

function formatPrice(n) {
  return n.toLocaleString("ro-RO") + " lei";
}

export default async function HomePage() {
  const [featuredProducts, allProducts] = await Promise.all([
    getFeaturedProducts(),
    getProducts(),
  ]);

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[90vh] overflow-hidden bg-stone-950">
        {/* Mobile background image */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="https://images.unsplash.com/photo-1572547030508-9c9c9d2140bf?w=1200&q=80"
            alt="Monument granit"
            fill
            className="object-cover brightness-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-stone-950/70" />
        </div>

        {/* Left — text content */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-8 py-20 lg:max-w-[52%] lg:px-16 lg:py-0 xl:px-24">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-gold-400">
            Servicii funerare complete
          </p>
          <h1 className="mb-6 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-5xl xl:text-6xl">
            Respect, Grijă și{" "}
            <span className="text-gold-400">Demnitate</span>{" "}
            în Momente Dificile
          </h1>
          <p className="mb-10 max-w-lg text-base leading-relaxed text-stone-400 sm:text-lg">
            Suntem alături de dumneavoastră în cele mai dificile clipe, oferind
            suport complet și îngrijire desăvârșită pentru cei dragi.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-block rounded bg-gold-500 px-8 py-3.5 text-center text-sm font-medium text-white transition-colors hover:bg-gold-600"
            >
              Contactați-ne
            </Link>
            <Link
              href="/produse"
              className="inline-block rounded border border-stone-600 px-8 py-3.5 text-center text-sm font-medium text-stone-300 transition-colors hover:border-stone-400 hover:text-white"
            >
              Vezi catalog
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 flex gap-8 border-t border-stone-800 pt-8">
            {[
              { value: "15+", label: "Ani experiență" },
              { value: "24/7", label: "Disponibili" },
              { value: "500+", label: "Familii ajutate" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-semibold text-white">{s.value}</p>
                <p className="mt-0.5 text-xs text-stone-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — 4 diagonal images (desktop only) */}
        <div
          className="relative hidden flex-1 lg:block"
          style={{ clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        >
          <div className="grid h-full grid-cols-2 grid-rows-2">
            {[
              "https://images.unsplash.com/photo-1572547030508-9c9c9d2140bf?w=800&q=80",
              "https://images.unsplash.com/photo-1699901610376-8f9fc9dea24b?w=800&q=80",
              "https://images.unsplash.com/photo-1719870173939-e6638ab2ff0a?w=800&q=80",
              "https://images.unsplash.com/photo-1644666218912-5c4069dc05f0?w=800&q=80",
            ].map((src, i) => (
              <div key={i} className="relative overflow-hidden">
                <Image
                  src={src}
                  alt="PrimNord Granit"
                  fill
                  className="object-cover brightness-75 transition-transform duration-700 hover:scale-105"
                  sizes="25vw"
                  priority={i < 2}
                />
                <div className="absolute inset-0 bg-stone-950/20" />
              </div>
            ))}
          </div>
          {/* Thin gold vertical accent line on the diagonal edge */}
          <div className="absolute inset-y-0 left-0 w-px bg-gold-500/40" />
        </div>

      </section>

      {/* ── Categories catalog ───────────────────────────────────── */}
      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold-500">
              Catalog complet
            </p>
            <h2 className="font-display text-3xl font-semibold text-stone-900">
              Categorii de Produse
            </h2>
            <p className="mt-3 text-stone-500">
              Alegeți categoria potrivită pentru a vedea toate produsele disponibile
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/produse?categoria=${encodeURIComponent(cat.name)}`}
                className="group relative overflow-hidden rounded-xl shadow-sm ring-1 ring-stone-200 transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/30 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-sm font-semibold leading-snug text-white sm:text-base">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-stone-300">
                    {cat.description}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-gold-400 underline-offset-2 group-hover:underline">
                    Vezi categoria
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/produse"
              className="inline-flex items-center gap-2 rounded bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700"
            >
              Vezi toate produsele
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Services overview ───────────────────────────────────── */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold-500">
              Ce oferim
            </p>
            <h2 className="font-display text-3xl font-semibold text-stone-900">
              Servicii Complete
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div
                key={s.id}
                className="rounded-lg bg-cream-50 p-6 shadow-sm ring-1 ring-stone-100 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-lg bg-cream-200 p-3 text-gold-600">
                  <ServiceIcon icon={s.icon} />
                </div>
                <h3 className="mb-2 font-display text-base font-semibold text-stone-900">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-500">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/servicii"
              className="inline-flex items-center gap-2 text-sm text-gold-600 underline underline-offset-4 decoration-gold-300 hover:decoration-gold-500"
            >
              Toate serviciile
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured products ───────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="bg-cream-100 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold-500">
                Materiale premium
              </p>
              <h2 className="font-display text-3xl font-semibold text-stone-900">
                Produse Recomandate
              </h2>
              <p className="mt-3 text-stone-500">
                Realizate din granit și marmură de calitate superioară
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/produse/${p.slug || p.id}`}
                  className="group overflow-hidden rounded-xl bg-white ring-1 ring-stone-100 transition-shadow hover:shadow-lg"
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
                    {p.originalPrice && (
                      <span className="absolute left-3 top-3 rounded bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                        -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium uppercase tracking-wider text-gold-500">
                      {p.material} · {p.category}
                    </span>
                    <h3 className="mt-1 font-display text-base font-semibold text-stone-900 transition-colors group-hover:text-gold-600">
                      {p.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-500">
                      {p.description}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="font-display text-lg font-semibold text-stone-900">
                        {formatPrice(p.price)}
                      </span>
                      {p.originalPrice && (
                        <span className="text-sm text-stone-400 line-through">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/produse"
                className="inline-flex items-center gap-2 rounded border border-stone-300 px-6 py-3 text-sm text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900"
              >
                Vezi toate produsele
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Quick price calculator ──────────────────────────────── */}
      <QuickQuote products={allProducts} />

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold-500">
              Ce spun clienții noștri
            </p>
            <h2 className="font-display text-3xl font-semibold text-stone-900">
              Mărturii de la familii pe care le-am ajutat
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <figure
                key={t.id}
                className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-100"
              >
                <div className="mb-3 flex gap-0.5 text-gold-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg key={i} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.366 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.366-2.446a1 1 0 00-1.176 0l-3.366 2.446c-.784.57-1.838-.196-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.161a1 1 0 00.951-.69l1.286-3.957z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="grow text-sm leading-relaxed text-stone-600 [overflow-wrap:anywhere]">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption className="mt-4 border-t border-stone-100 pt-4">
                  <p className="font-display text-sm font-semibold text-stone-900">
                    {t.name}
                  </p>
                  <p className="text-xs text-stone-400">{t.location}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why us ──────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold-500">
              De ce noi
            </p>
            <h2 className="font-display text-3xl font-semibold text-stone-900">
              Angajamentul nostru față de familie
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Disponibili 24/7",
                text: "Suntem alături de dumneavoastră în orice moment, zi și noapte, pentru a răspunde nevoilor imediate.",
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "Peste 15 ani experiență",
                text: "Experiența acumulată ne permite să gestionăm fiecare situație cu profesionalism și sensibilitate.",
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                ),
              },
              {
                title: "Prețuri transparente",
                text: "Fără costuri ascunse. Prezentăm toate detaliile clar, astfel încât familia să se poată concentra pe doliu.",
                icon: (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto mb-4 inline-flex rounded-full bg-cream-100 p-4 text-gold-500 shadow-sm ring-1 ring-stone-100">
                  {item.icon}
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-stone-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-stone-900 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 font-display text-3xl font-semibold text-white">
            Suntem alături de dumneavoastră
          </h2>
          <p className="mb-8 text-stone-400">
            Nu ezitați să ne contactați. Echipa noastră este disponibilă oricând
            pentru a vă oferi sprijin și îndrumare.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={`tel:${companyInfo.phone}`}
              className="flex w-full items-center justify-center gap-2 rounded bg-gold-500 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-gold-600 sm:w-auto"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {companyInfo.phone}
            </a>
            <Link
              href="/contact"
              className="w-full rounded border border-stone-600 px-8 py-3.5 text-center text-sm font-medium text-stone-300 transition-colors hover:border-stone-400 hover:text-white sm:w-auto"
            >
              Trimiteți un mesaj
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
