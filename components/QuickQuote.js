"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { id: "monument-standard", label: "Monument standard", base: 6500 },
  { id: "monument-dublu", label: "Monument dublu", base: 11500 },
  { id: "monument-vip", label: "Monument VIP", base: 18000 },
  { id: "monument-copii", label: "Monument copii", base: 4800 },
  { id: "cruce", label: "Cruce", base: 2200 },
  { id: "gard", label: "Gard mormânt", base: 3800 },
  { id: "fundatie", label: "Fundație", base: 2500 },
  { id: "accesorii", label: "Accesorii / Coroană", base: 800 },
];

const MATERIALS = [
  { id: "granit-standard", label: "Granit standard", mult: 1 },
  { id: "granit-negru", label: "Granit negru premium", mult: 1.4 },
  { id: "marmura", label: "Marmură", mult: 1.55 },
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

export default function QuickQuote() {
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [material, setMaterial] = useState(MATERIALS[0].id);
  const [size, setSize] = useState(SIZES[1].id);
  const [extras, setExtras] = useState(new Set());

  const result = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.id === category);
    const mat = MATERIALS.find((m) => m.id === material);
    const sz = SIZES.find((s) => s.id === size);
    const base = cat.base * mat.mult * sz.mult;
    const extrasTotal = [...extras].reduce((sum, id) => {
      const ex = EXTRAS.find((e) => e.id === id);
      return sum + (ex?.add ?? 0);
    }, 0);
    const total = base + extrasTotal;
    return { min: total * 0.9, max: total * 1.15 };
  }, [category, material, size, extras]);

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
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`rounded-lg border px-4 py-2.5 text-left text-sm transition ${
                      category === c.id
                        ? "border-gold-400 bg-gold-500/10 text-gold-300"
                        : "border-stone-700 text-stone-300 hover:border-stone-500"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">
                Material
              </label>
              <div className="grid gap-2 sm:grid-cols-3">
                {MATERIALS.map((m) => (
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

            {/* Extras */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">
                Opțiuni suplimentare
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {EXTRAS.map((e) => {
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
          </div>

          {/* Result */}
          <div className="self-start rounded-2xl bg-gradient-to-br from-gold-500/15 to-stone-900 p-6 ring-1 ring-gold-500/30 sm:p-8 lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">
              Preț estimat
            </p>
            <p className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              {formatPrice(result.min)}
              <span className="text-stone-500"> — </span>
              {formatPrice(result.max)}
            </p>
            <p className="mt-3 text-xs text-stone-400">
              Estimare orientativă. Prețul final depinde de detalii precum gravura, design personalizat și locația montajului.
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
