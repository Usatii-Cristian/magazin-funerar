"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Each calculator category maps to one or more DB categories.
// `fallback` kicks in only when there are no products yet in those DB categories.
const ALL_MATERIALS = ["granit-standard", "granit-negru", "marmura"];
const STONE_EXTRAS = ["gravura-foto", "foto-ceramica", "vaza", "iluminare", "lampa"];

const CATEGORIES = [
  {
    id: "monument-standard",
    label: "Monument standard",
    dbCategories: ["Monumente Standart", "Monumente Gri"],
    fallback: 6500,
    materials: ALL_MATERIALS,
    extras: STONE_EXTRAS,
  },
  {
    id: "monument-dublu",
    label: "Monument dublu",
    dbCategories: ["Monumente Duble"],
    fallback: 11500,
    materials: ALL_MATERIALS,
    extras: STONE_EXTRAS,
  },
  {
    id: "monument-vip",
    label: "Monument VIP",
    dbCategories: ["Monumente Vip", "Monumente Complex"],
    fallback: 18000,
    materials: ALL_MATERIALS,
    extras: STONE_EXTRAS,
  },
  {
    id: "monument-copii",
    label: "Monument copii",
    dbCategories: ["Monumente Copii"],
    fallback: 4800,
    materials: ALL_MATERIALS,
    extras: STONE_EXTRAS,
  },
  {
    id: "cruce",
    label: "Cruce",
    dbCategories: ["Cruci"],
    fallback: 2200,
    materials: ["granit-standard", "granit-negru"],
    extras: ["gravura-foto", "foto-ceramica", "lampa"],
  },
  {
    id: "gard",
    label: "Gard mormânt",
    dbCategories: ["Garduri Morminte"],
    fallback: 3800,
    materials: ["granit-standard", "granit-negru"],
    extras: [],
  },
  {
    id: "fundatie",
    label: "Fundație",
    dbCategories: ["Fundatii din Granit", "Fundatii din Beton Armat"],
    fallback: 2500,
    materials: ["granit-standard"],
    extras: [],
  },
  {
    id: "accesorii",
    label: "Accesorii monument",
    dbCategories: ["Accesorii Monumente"],
    fallback: 800,
    materials: ["granit-standard", "granit-negru"],
    extras: [],
  },
  {
    id: "coroane",
    label: "Coroană funerară",
    dbCategories: ["Coroane"],
    fallback: 600,
    materials: [],
    extras: [],
  },
  {
    id: "sicrie",
    label: "Sicriu",
    dbCategories: ["Sicrie"],
    fallback: 3500,
    materials: [],
    extras: [],
  },
];

const MATERIALS = [
  { id: "granit-standard", label: "Granit standard", mult: 1, match: ["granit"] },
  { id: "granit-negru", label: "Granit negru premium", mult: 1.4, match: ["negru", "premium"] },
  { id: "marmura", label: "Marmură", mult: 1.55, match: ["marmur"] },
];

const SIZES = [
  { id: "mic", label: "Mic", mult: 0.85 },
  { id: "mediu", label: "Mediu", mult: 1 },
  { id: "mare", label: "Mare", mult: 1.25 },
];

const EXTRAS = [
  { id: "gravura-foto", label: "Gravură foto", add: 800 },
  { id: "foto-ceramica", label: "Foto-ceramică", add: 600 },
  { id: "vaza", label: "Vază granit", add: 350 },
  { id: "iluminare", label: "Iluminare LED solară", add: 500 },
  { id: "lampa", label: "Lampadar / candelă", add: 280 },
];

function formatPrice(n) {
  return Math.round(n).toLocaleString("ro-RO") + " lei";
}

function pickProductsFor(products, dbCategories) {
  const set = new Set(dbCategories);
  return (products ?? []).filter(
    (p) => set.has(p.category) && typeof p.price === "number" && p.price > 0
  );
}

export default function QuickQuote({ products = [] }) {
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [material, setMaterial] = useState(MATERIALS[0].id);
  const [size, setSize] = useState(SIZES[1].id);
  const [extras, setExtras] = useState(new Set());

  const currentCat = CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0];
  const visibleMaterials = MATERIALS.filter((m) =>
    currentCat.materials.includes(m.id)
  );
  const visibleExtras = EXTRAS.filter((e) => currentCat.extras.includes(e.id));

  // Drop selections that no longer apply when switching categories.
  useEffect(() => {
    if (visibleMaterials.length > 0 && !currentCat.materials.includes(material)) {
      setMaterial(visibleMaterials[0].id);
    }
    setExtras((prev) => {
      const allowed = new Set(currentCat.extras);
      const next = new Set([...prev].filter((id) => allowed.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-compute price range per category from real products
  const categoryRanges = useMemo(() => {
    const map = {};
    for (const cat of CATEGORIES) {
      const matches = pickProductsFor(products, cat.dbCategories);
      if (matches.length === 0) {
        map[cat.id] = { min: cat.fallback, max: cat.fallback, count: 0 };
      } else {
        const prices = matches.map((p) => p.price);
        map[cat.id] = {
          min: Math.min(...prices),
          max: Math.max(...prices),
          count: matches.length,
        };
      }
    }
    return map;
  }, [products]);

  const result = useMemo(() => {
    const range = categoryRanges[category];
    const mat = MATERIALS.find((m) => m.id === material);
    const sz = SIZES.find((s) => s.id === size);
    const extrasTotal = [...extras].reduce((sum, id) => {
      const ex = EXTRAS.find((e) => e.id === id);
      return sum + (ex?.add ?? 0);
    }, 0);
    const matMult = mat && currentCat.materials.includes(mat.id) ? mat.mult : 1;
    const factor = matMult * sz.mult;
    return {
      min: range.min * factor + extrasTotal,
      max: range.max * factor + extrasTotal,
      count: range.count,
    };
  }, [categoryRanges, category, material, size, extras, currentCat]);

  function toggleExtra(id) {
    setExtras((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="bg-stone-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold-400">
            Calculator preț orientativ
          </p>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Aflați rapid prețul aproximativ
          </h2>
          <p className="mt-3 text-stone-400">
            Selectați opțiunile dorite — vă oferim o estimare în câteva secunde
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <div className="space-y-6 rounded-2xl bg-stone-900/60 p-6 ring-1 ring-stone-800 sm:p-8">
            {/* Category */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">
                Tip produs
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {CATEGORIES.map((c) => {
                  const r = categoryRanges[c.id];
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id)}
                      className={`flex flex-col gap-0.5 rounded-lg border px-4 py-2.5 text-left text-sm transition ${
                        category === c.id
                          ? "border-gold-400 bg-gold-500/10 text-gold-300"
                          : "border-stone-700 text-stone-300 hover:border-stone-500"
                      }`}
                    >
                      <span>{c.label}</span>
                      <span className="text-[11px] text-stone-500">
                        {r.count > 0
                          ? `${formatPrice(r.min)} – ${formatPrice(r.max)}`
                          : "Estimare orientativă"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Material — hidden for categories without stone material (coroane, sicrie) */}
            {visibleMaterials.length > 0 && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Material
                </label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {visibleMaterials.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMaterial(m.id)}
                      className={`rounded-lg border px-4 py-2.5 text-sm transition ${
                        material === m.id
                          ? "border-gold-400 bg-gold-500/10 text-gold-300"
                          : "border-stone-700 text-stone-300 hover:border-stone-500"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">
                Dimensiune
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSize(s.id)}
                    className={`rounded-lg border px-4 py-2.5 text-sm transition ${
                      size === s.id
                        ? "border-gold-400 bg-gold-500/10 text-gold-300"
                        : "border-stone-700 text-stone-300 hover:border-stone-500"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Extras — hidden for categories without applicable add-ons */}
            {visibleExtras.length > 0 && (
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Opțiuni suplimentare
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {visibleExtras.map((e) => {
                    const active = extras.has(e.id);
                    return (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => toggleExtra(e.id)}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                          active
                            ? "border-gold-400 bg-gold-500/10 text-gold-300"
                            : "border-stone-700 text-stone-300 hover:border-stone-500"
                        }`}
                      >
                        <span>{e.label}</span>
                        <span className="text-xs text-stone-400">+{e.add} lei</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Result */}
          <div className="self-start rounded-2xl bg-gradient-to-br from-gold-500/15 to-stone-900 p-6 ring-1 ring-gold-500/30 sm:p-8 lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">
              Preț estimat
            </p>
            <p className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              {result.min === result.max
                ? formatPrice(result.min)
                : (
                  <>
                    {formatPrice(result.min)}
                    <span className="text-stone-500"> — </span>
                    {formatPrice(result.max)}
                  </>
                )}
            </p>
            <p className="mt-3 text-xs text-stone-400">
              {result.count > 0
                ? `Bazat pe ${result.count} ${result.count === 1 ? "produs" : "produse"} din catalog. Prețul final depinde de gravură, design și locație.`
                : "Estimare orientativă. Prețul final depinde de gravură, design și locație."}
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/contact"
                className="rounded-lg bg-gold-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-gold-600"
              >
                Cere ofertă fermă
              </Link>
              <Link
                href="/produse"
                className="rounded-lg border border-stone-700 px-4 py-3 text-center text-sm font-medium text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                Vezi catalogul complet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
