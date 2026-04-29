"use client";

import Link from "next/link";
import Image from "next/image";
import { useCompare } from "@/lib/useCompare";

function formatPrice(n) {
  return n.toLocaleString("ro-RO") + " lei";
}

export default function CompareClient({ products }) {
  const { ids, hydrated, remove, clear } = useCompare();

  if (!hydrated) {
    return (
      <section className="bg-cream-50 px-6 py-16">
        <div className="mx-auto max-w-6xl text-center text-stone-400">
          Se încarcă...
        </div>
      </section>
    );
  }

  const selected = ids
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  if (selected.length === 0) {
    return (
      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-semibold text-stone-900">
            Niciun produs de comparat
          </h1>
          <p className="mt-3 text-stone-500">
            Adăugați produse la comparație folosind butonul de pe cardurile din catalog.
          </p>
          <Link
            href="/produse"
            className="mt-8 inline-block rounded-lg bg-gold-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-600"
          >
            Mergi la catalog
          </Link>
        </div>
      </section>
    );
  }

  const rows = [
    { label: "Preț", get: (p) => formatPrice(p.price) },
    {
      label: "Preț original",
      get: (p) => (p.originalPrice ? formatPrice(p.originalPrice) : "—"),
    },
    {
      label: "Reducere",
      get: (p) =>
        p.originalPrice
          ? `-${Math.round((1 - p.price / p.originalPrice) * 100)}%`
          : "—",
    },
    { label: "Categorie", get: (p) => p.category },
    { label: "Material", get: (p) => p.material },
    { label: "Dimensiuni", get: (p) => p.dimensions || "—" },
    { label: "Garanție", get: () => "Lucrare garantată" },
    { label: "Montaj", get: () => "Inclus în preț" },
  ];

  return (
    <section className="bg-cream-50 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-stone-900 sm:text-3xl">
              Comparare produse
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              {selected.length} {selected.length === 1 ? "produs selectat" : "produse selectate"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clear}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400"
            >
              Șterge tot
            </button>
            <Link
              href="/produse"
              className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              + Adaugă produse
            </Link>
          </div>
        </div>

        {/* Cards row */}
        <div className={`grid gap-4 ${selected.length === 1 ? "sm:grid-cols-1" : selected.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
          {selected.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-100"
            >
              <div className="relative h-48 bg-stone-100">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-stone-300">
                    <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M4.5 3h15A1.5 1.5 0 0121 4.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15A1.5 1.5 0 014.5 3z" />
                    </svg>
                  </div>
                )}
                <button
                  onClick={() => remove(p.id)}
                  aria-label="Elimină din comparație"
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-stone-700 shadow transition hover:bg-red-500 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 break-words font-display text-base font-semibold text-stone-900 [overflow-wrap:anywhere]">
                  {p.name}
                </h3>
                <Link
                  href={`/produse/${p.slug || p.id}`}
                  className="mt-3 inline-block text-xs font-medium text-gold-600 underline-offset-2 hover:underline"
                >
                  Vezi detalii →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-100">
          <table className="w-full text-sm">
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.label} className={idx % 2 === 0 ? "bg-cream-50/40" : ""}>
                  <th className="w-1/4 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-stone-500 sm:px-6">
                    {row.label}
                  </th>
                  {selected.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-stone-800 [overflow-wrap:anywhere] sm:px-6">
                      {row.get(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center text-xs text-stone-400">
          Lista de comparare se păstrează doar pe acest dispozitiv.
        </div>
      </div>
    </section>
  );
}
