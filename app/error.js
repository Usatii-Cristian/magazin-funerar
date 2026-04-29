"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-cream-50 px-6 py-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="font-display text-7xl font-semibold text-gold-500 sm:text-8xl">
          500
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-stone-900 sm:text-3xl">
          A apărut o eroare neașteptată
        </h1>
        <p className="mt-3 text-stone-500">
          Ne pare rău, ceva nu a funcționat. Reîncărcați pagina sau contactați-ne dacă problema persistă.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-gold-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-gold-600"
          >
            Încercați din nou
          </button>
          <Link
            href="/"
            className="rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400"
          >
            Pagina principală
          </Link>
        </div>
      </div>
    </div>
  );
}
