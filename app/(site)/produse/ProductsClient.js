"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CompareButton from "@/components/CompareButton";

const CATEGORIES = [
  "Toate",
  "Monumente Standart",
  "Monumente Duble",
  "Monumente Vip",
  "Monumente Copii",
  "Monumente Complex",
  "Monumente Gri",
  "Monumente Beton Armat",
  "Accesorii Monumente",
  "Garduri Morminte",
  "Mese si Scaune",
  "Scari si Pervazuri",
  "Cruci",
  "Sicrie",
  "Coroane",
  "Fundatii din Granit",
  "Fundatii din Beton Armat",
];

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

const PAGE_SIZE = 9;

function PriceFilter({ priceRange, onChange, large }) {
  return (
    <div className={large ? "mb-6 pb-6 border-b border-stone-100" : "mt-5 border-t border-stone-100 pt-5"}>
      <p className={`mb-2 font-semibold uppercase tracking-wider text-stone-400 ${large ? "text-xs" : "text-xs"}`}>
        Preț (lei)
      </p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          placeholder="Min"
          value={priceRange.min}
          onChange={(e) => onChange("min", e.target.value.replace(/\D/g, ""))}
          className={`w-full rounded-lg border border-stone-200 bg-white text-stone-700 outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 ${large ? "px-3 py-2.5 text-sm" : "px-2 py-2.5 text-xs"}`}
        />
        <span className="shrink-0 text-stone-300">—</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Max"
          value={priceRange.max}
          onChange={(e) => onChange("max", e.target.value.replace(/\D/g, ""))}
          className={`w-full rounded-lg border border-stone-200 bg-white text-stone-700 outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 ${large ? "px-3 py-2.5 text-sm" : "px-2 py-2.5 text-xs"}`}
        />
      </div>
    </div>
  );
}

function FilterList({ active, onSelect, onClose }) {
  return (
    <nav className="space-y-0.5">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            onSelect(cat);
            onClose?.();
          }}
          className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            active === cat
              ? "bg-stone-900 font-semibold text-white"
              : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
          }`}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}

const SORT_OPTIONS = [
  { value: "default", label: "Sortare implicită" },
  { value: "price-asc", label: "Preț: crescător" },
  { value: "price-desc", label: "Preț: descrescător" },
  { value: "name-asc", label: "Alfabetic A-Z" },
  { value: "name-desc", label: "Alfabetic Z-A" },
];

export default function ProductsClient({ products, initialCategory = "Toate" }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  function handleCategorySelect(cat) {
    setActiveCategory(cat);
    setVisibleCount(PAGE_SIZE);
  }

  function handlePriceChange(field, value) {
    setPriceRange((prev) => ({ ...prev, [field]: value }));
    setVisibleCount(PAGE_SIZE);
  }

  function handleSearch(value) {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  }

  const filtered = products.filter((p) => {
    if (activeCategory !== "Toate" && p.category !== activeCategory) return false;
    const min = parseInt(priceRange.min);
    const max = parseInt(priceRange.max);
    if (!isNaN(min) && p.price < min) return false;
    if (!isNaN(max) && p.price > max) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "name-asc": return a.name.localeCompare(b.name, "ro");
      case "name-desc": return b.name.localeCompare(a.name, "ro");
      default: return 0;
    }
  });

  const displayed = sorted.slice(0, visibleCount);
  const hasMore = sorted.length > visibleCount;

  const activeFilterCount =
    (activeCategory !== "Toate" ? 1 : 0) +
    (priceRange.min || priceRange.max ? 1 : 0);

  return (
    <section className="bg-cream-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Mobile filter button */}
        <div className="mb-6 md:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-400"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filtre
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-stone-900 px-2 py-0.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeCategory !== "Toate" && (
            <span className="ml-3 text-sm text-stone-500">
              Categorie: <strong className="text-stone-800">{activeCategory}</strong>
            </span>
          )}
        </div>

        {/* Mobile filter drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[85vw] max-w-xs overflow-y-auto bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-stone-900">
                  Filtre
                </h3>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Închide filtrele"
                  className="-mr-2 rounded-lg p-3 text-stone-400 hover:bg-stone-100"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <PriceFilter priceRange={priceRange} onChange={handlePriceChange} />
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
                Categorie
              </p>
              <FilterList
                active={activeCategory}
                onSelect={handleCategorySelect}
                onClose={() => setDrawerOpen(false)}
              />
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-56 shrink-0 md:block">
            <div className="sticky top-28">
              <PriceFilter priceRange={priceRange} onChange={handlePriceChange} large />
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400">
                Categorie
              </p>
              <FilterList active={activeCategory} onSelect={handleCategorySelect} />
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <div className="mb-5 relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
              </svg>
              <input
                type="text"
                placeholder="Caută produs..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-base text-stone-700 shadow-sm outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 sm:text-sm"
              />
              {search && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-stone-500">
                <span className="font-semibold text-stone-800">{filtered.length}</span>{" "}
                produse{activeCategory !== "Toate" ? ` în ${activeCategory}` : ""}
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <p className="py-20 text-center text-stone-400">
                Nu există produse în această categorie.
              </p>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {displayed.map((p) => {
                    const pct = p.originalPrice
                      ? Math.round((1 - p.price / p.originalPrice) * 100)
                      : null;
                    return (
                      <article
                        key={p.id}
                        className="group relative overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 ring-stone-100 transition-shadow hover:shadow-lg"
                      >
                        <div className="relative h-52 overflow-hidden bg-stone-100">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              unoptimized={p.image?.startsWith("/uploads/")}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-stone-300">
                              <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M4.5 3h15A1.5 1.5 0 0121 4.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15A1.5 1.5 0 014.5 3z" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-stone-900/25" />
                          <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
                            <span
                              className={`self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryBadge[p.category] ?? "bg-stone-100 text-stone-700"}`}
                            >
                              {p.category}
                            </span>
                            {pct && (
                              <span className="self-start rounded bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                                -{pct}%
                              </span>
                            )}
                          </div>
                          <div className="absolute right-3 top-3 z-20">
                            <CompareButton productId={p.id} />
                          </div>
                        </div>

                        <div className="p-5">
                          <p className="text-xs font-medium uppercase tracking-wider text-gold-500">
                            {p.material}
                          </p>
                          <h3 className="mt-1 font-display text-base font-semibold text-stone-900 transition-colors group-hover:text-gold-600">
                            <Link
                              href={`/produse/${p.slug || p.id}`}
                              className="before:absolute before:inset-0 before:z-0 before:content-[''] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                            >
                              {p.name}
                            </Link>
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-500">
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
                      </article>
                    );
                  })}
                </div>

                {hasMore && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                      className="rounded-lg border border-stone-300 bg-white px-8 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:border-gold-400 hover:text-gold-700"
                    >
                      Încarcă mai multe{" "}
                      <span className="text-stone-400">
                        ({sorted.length - visibleCount} rămase)
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="mt-14 text-center">
              <p className="mb-4 text-sm text-stone-500">
                Doriți un design personalizat sau un preț special?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded bg-gold-500 px-6 py-3 text-sm font-medium text-white hover:bg-gold-600"
              >
                Cereți o ofertă personalizată
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
