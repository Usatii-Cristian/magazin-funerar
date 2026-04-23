"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

const emptyForm = {
  name: "",
  material: "Granit",
  price: "",
  discountPct: "",
  description: "",
  dimensions: "",
  featured: false,
};

export default function NewProductPage() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [imagePreviews, setImagePreviews] = useState([]); // { url, file }
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const router = useRouter();

  const originalPrice = parseInt(form.price) || 0;
  const discountPct = parseInt(form.discountPct) || 0;
  const discountedPrice =
    originalPrice > 0 && discountPct > 0
      ? Math.round(originalPrice * (1 - discountPct / 100))
      : null;

  function handleFiles(e) {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setImagePreviews((prev) => [...prev, { url, file }]);
    });
    e.target.value = "";
  }

  function removeImage(index) {
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      let uploadedUrls = [];

      if (imagePreviews.length > 0) {
        setUploading(true);
        const fd = new FormData();
        imagePreviews.forEach(({ file }) => fd.append("images", file));
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Eroare la upload imagini");
        uploadedUrls = data.urls;
        setUploading(false);
      }

      const body = {
        name: form.name,
        category,
        material: form.material,
        price: discountedPrice ?? originalPrice,
        originalPrice: discountedPrice ? originalPrice : null,
        description: form.description,
        dimensions: form.dimensions || null,
        featured: form.featured,
        images: uploadedUrls,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la salvare");

      router.push("/admin/produse");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSaving(false);
      setUploading(false);
    }
  }

  if (step === 1) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-stone-900">
            Produs nou
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Pas 1 din 2 — Selectați categoria produsului
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setStep(2);
              }}
              className="rounded-xl border-2 border-stone-100 bg-white p-4 text-left transition-all hover:border-gold-400 hover:shadow-md"
            >
              <span className="text-sm font-semibold text-stone-900">{cat}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => setStep(1)}
          className="mb-4 flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-800"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Schimbă categoria
        </button>
        <h1 className="font-display text-2xl font-semibold text-stone-900">
          Produs nou
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Pas 2 din 2 — Categorie:{" "}
          <strong className="text-stone-900">{category}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Denumire produs{" "}
            <span className="text-gold-500">*</span>
            <span className="ml-2 text-xs font-normal text-stone-400">
              (afișat bold pe site)
            </span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Ex: Monument Granit Negru Standard"
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-900 outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
          />
        </div>

        {/* Material */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Material
          </label>
          <input
            type="text"
            value={form.material}
            onChange={(e) =>
              setForm((p) => ({ ...p, material: e.target.value }))
            }
            placeholder="Ex: Granit negru, Marmură albă..."
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
          />
        </div>

        {/* Price + Discount */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">
              Preț{" "}
              <span className="text-gold-500">*</span>
              <span className="ml-1 text-xs font-normal text-stone-400">
                (lei)
              </span>
            </label>
            <input
              type="number"
              required
              min="1"
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: e.target.value }))
              }
              placeholder="Ex: 3200"
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">
              Reducere{" "}
              <span className="text-xs font-normal text-stone-400">
                (%, opțional)
              </span>
            </label>
            <input
              type="number"
              min="1"
              max="99"
              value={form.discountPct}
              onChange={(e) =>
                setForm((p) => ({ ...p, discountPct: e.target.value }))
              }
              placeholder="Ex: 15"
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
            />
          </div>
        </div>

        {/* Calculated price */}
        {discountedPrice !== null && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-sm">
                Preț după reducere de{" "}
                <strong>{discountPct}%</strong>:{" "}
                <strong className="text-base text-emerald-900">
                  {discountedPrice.toLocaleString("ro-RO")} lei
                </strong>
              </span>
            </div>
            <p className="mt-1 pl-6 text-xs text-emerald-600">
              Prețul original ({originalPrice.toLocaleString("ro-RO")} lei) va
              apărea tăiat pe site
            </p>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Descriere <span className="text-gold-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Descrieți produsul detaliat — material, finisaj, caracteristici..."
            className="w-full resize-none rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
          />
        </div>

        {/* Dimensions */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Dimensiuni{" "}
            <span className="text-xs font-normal text-stone-400">(opțional)</span>
          </label>
          <input
            type="text"
            value={form.dimensions}
            onChange={(e) =>
              setForm((p) => ({ ...p, dimensions: e.target.value }))
            }
            placeholder="Ex: 100×50×30 cm, Înălțime 120 cm..."
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
          />
        </div>

        {/* Featured */}
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              setForm((p) => ({ ...p, featured: e.target.checked }))
            }
            className="h-4 w-4 rounded border-stone-300 text-gold-500 accent-stone-900"
          />
          <span className="text-sm text-stone-700">
            Produs recomandat{" "}
            <span className="text-stone-400">(afișat pe pagina principală)</span>
          </span>
        </label>

        {/* Images */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-stone-700">
            Imagini
          </label>

          {imagePreviews.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {imagePreviews.map((img, i) => (
                <div key={i} className="group relative">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-stone-100">
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 px-6 py-5 text-sm text-stone-500 transition-colors hover:border-gold-400 hover:text-gold-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {imagePreviews.length === 0
              ? "Selectați una sau mai multe imagini"
              : "Adaugă mai multe imagini"}
          </button>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/admin/produse")}
            className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
          >
            Anulează
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-1 rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:opacity-60"
          >
            {uploading
              ? "Se încarcă imaginile..."
              : saving
              ? "Se salvează..."
              : "Salvează produsul"}
          </button>
        </div>
      </form>
    </div>
  );
}
