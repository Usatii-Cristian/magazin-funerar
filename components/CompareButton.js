"use client";

import { useCompare } from "@/lib/useCompare";

export default function CompareButton({ productId, className = "", onToast }) {
  const { has, full, toggle, hydrated } = useCompare();
  const active = has(productId);

  if (!hydrated) return null;

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!active && full) {
      onToast?.("Maxim 3 produse de comparat. Eliminați unul ca să adăugați altul.");
      return;
    }
    toggle(productId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? "Elimină din comparație" : "Adaugă la comparație"}
      title={active ? "Elimină din comparație" : "Adaugă la comparație"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
        active
          ? "border-gold-500 bg-gold-500 text-white shadow-sm"
          : "border-stone-200 bg-white/95 text-stone-500 backdrop-blur hover:border-gold-400 hover:text-gold-600"
      } ${className}`}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h13.5m0 0L13.5 4.5m3 3l-3 3M21 16.5H7.5m0 0L10.5 13.5m-3 3l3 3" />
      </svg>
    </button>
  );
}
