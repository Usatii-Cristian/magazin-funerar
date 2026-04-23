"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
  "Cruci": "bg-red-100 text-red-700",
  "Sicrie": "bg-neutral-200 text-neutral-700",
  "Coroane": "bg-green-100 text-green-700",
  "Fundatii din Granit": "bg-orange-100 text-orange-700",
  "Fundatii din Beton Armat": "bg-yellow-100 text-yellow-700",
};

function formatPrice(n) {
  return n.toLocaleString("ro-RO") + " lei";
}

export default function ProductsClient({ products, initialCategory = "Toate" }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filtered =
    activeCategory === "Toate"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section className="bg-cream-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Category tabs — scrollable */}
        <div className="-mx-6 mb-10 overflow-x-auto px-6">
          <div className="flex gap-2 pb-2" style={{ minWidth: "max-content" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-stone-900 text-white"
                    : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-stone-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-stone-400">
            Nu există produse în această categorie.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => {
              const pct = p.originalPrice
                ? Math.round((1 - p.price / p.originalPrice) * 100)
                : null;
              return (
                <Link
                  key={p.id}
                  href={`/produse/${p.id}`}
                  className="group overflow-hidden rounded-xl bg-white text-left shadow-sm ring-1 ring-stone-100 transition-shadow hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized={p.image.startsWith("/uploads/")}
                    />
                    <div className="absolute inset-0 bg-stone-900/25" />
                    <div className="absolute left-3 top-3 flex gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryBadge[p.category] ?? "bg-stone-100 text-stone-700"}`}
                      >
                        {p.category}
                      </span>
                      {pct && (
                        <span className="rounded bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                          -{pct}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-gold-500">
                      {p.material}
                    </p>
                    <h3 className="mt-1 font-display text-base font-semibold text-stone-900 transition-colors group-hover:text-gold-600">
                      {p.name}
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
                </Link>
              );
            })}
          </div>
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
    </section>
  );
}
