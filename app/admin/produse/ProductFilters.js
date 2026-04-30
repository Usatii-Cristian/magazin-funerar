"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const CATEGORIES = [
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

export default function ProductFilters({ total }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const category = params.get("category") || "";
  const featured = params.get("featured") === "1";

  function update(updates) {
    const p = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    p.delete("page");
    const q = p.toString();
    router.push(q ? `${pathname}?${q}` : pathname);
  }

  const hasFilters = category || featured;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <select
        value={category}
        onChange={(e) => update({ category: e.target.value })}
        className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
      >
        <option value="">Toate categoriile</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <button
        onClick={() => update({ featured: featured ? "" : "1" })}
        className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
          featured
            ? "border-gold-500 bg-gold-50 text-gold-700"
            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
        }`}
      >
        ★ Recomandate
      </button>

      {hasFilters && (
        <button
          onClick={() => update({ category: "", featured: "" })}
          className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-400 transition hover:text-stone-600"
        >
          × Șterge filtre
        </button>
      )}

      <span className="ml-auto text-sm text-stone-400">
        {total} {total === 1 ? "produs" : "produse"}
      </span>
    </div>
  );
}
