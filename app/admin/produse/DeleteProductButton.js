"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ productId, productName }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Eroare la ștergere");
      router.refresh();
    } catch {
      alert(
        "Produsul NU a fost șters — baza de date nu a răspuns.\n\n" +
        "Ce poți face:\n" +
        "1. Încearcă din nou peste câteva secunde.\n" +
        "2. Dacă eroarea persistă, șterge produsul direct din MongoDB Compass."
      );
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-500">Sigur?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-60"
        >
          {loading ? "..." : "Da"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-stone-500 ring-1 ring-stone-200 hover:ring-stone-400"
        >
          Nu
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 ring-1 ring-red-100 hover:bg-red-50 hover:ring-red-300 transition-colors"
    >
      Șterge
    </button>
  );
}
