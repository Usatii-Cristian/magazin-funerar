"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "@/lib/useCompare";

export default function CompareBar() {
  const pathname = usePathname();
  const { ids, clear, hydrated } = useCompare();

  if (!hydrated) return null;
  if (ids.length === 0) return null;
  if (pathname?.startsWith("/admin")) return null;
  if (pathname === "/produse/comparare") return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-30 mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-3 shadow-2xl ring-1 ring-black/5 md:bottom-6 md:left-6 md:right-auto md:max-w-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Comparare ({ids.length}/3)
        </p>
        <button
          onClick={clear}
          className="text-xs text-stone-400 transition hover:text-stone-700"
          aria-label="Șterge tot"
        >
          Șterge tot
        </button>
      </div>
      <Link
        href="/produse/comparare"
        className="block rounded-lg bg-gold-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-gold-600"
      >
        Vezi comparație →
      </Link>
    </div>
  );
}
