"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { optimizeImage } from "@/lib/optimizeImage";

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { error: text.slice(0, 200) };
  }
}

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

export default function EditProductForm({ product }) {
  const router = useRouter();
  const fileRef = useRef(null);

  const initOriginalPrice =
    product.originalPrice ?? product.price;
  const initDiscountPct =
    product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

  const [form, setForm] = useState({
    name: product.name,
    category: product.category,
    material: product.material,
    price: String(initOriginalPrice),
    discountPct: initDiscountPct > 0 ? String(initDiscountPct) : "",
    description: product.description,
    dimensions: product.dimensions || "",
    featured: product.featured,
  });

  const [allImages, setAllImages] = useState(
    (product.images || []).map((url) => ({ url, isExisting: true, file: null }))
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const originalPrice = parseInt(form.price) || 0;
  const discountPct = parseInt(form.discountPct) || 0;
  const discountedPrice =
    originalPrice > 0 && discountPct > 0
      ? Math.round(originalPrice * (1 - discountPct / 100))
      : null;

  function handleFiles(e) {
    Array.from(e.target.files).forEach((file) => {
      setAllImages((prev) => [
        ...prev,
        { url: URL.createObjectURL(file), isExisting: false, file },
      ]);
    });
    e.target.value = "";
  }

  function removeImage(index) {
    setAllImages((prev) => {
      if (!prev[index].isExisting) URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  function setPrimary(index) {
    setAllImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      return [item, ...next];
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const newFiles = allImages.filter((img) => !img.isExisting).map((img) => img.file);
      let newUrls = [];
      if (newFiles.length > 0) {
        setUploading(true);
        const optimized = await Promise.all(newFiles.map((f) => optimizeImage(f)));
        const ext = (name) => {
          const e = name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
          return e || "jpg";
        };
        const results = await Promise.all(
          optimized.map((file) =>
            upload(`products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext(file.name)}`, file, {
              access: "public",
              handleUploadUrl: "/api/admin/upload",
            })
          )
        );
        newUrls = results.map((r) => r.url);
        setUploading(false);
      }

      let newIndex = 0;
      const orderedImages = allImages.map((img) =>
        img.isExisting ? img.url : newUrls[newIndex++]
      );

      const body = {
        name: form.name,
        category: form.category,
        material: form.material,
        price: discountedPrice ?? originalPrice,
        originalPrice: discountedPrice ? originalPrice : null,
        description: form.description,
        dimensions: form.dimensions || null,
        featured: form.featured,
        images: orderedImages,
      };

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      const data = text ? safeParse(text) : {};
      if (!res.ok) throw new Error(data.error || `Eroare la salvare (${res.status})`);

      router.push("/admin/produse");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSaving(false);
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => router.push("/admin/produse")}
          className="mb-4 flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Înapoi la produse
        </button>
        <h1 className="font-display text-2xl font-semibold text-stone-900">
          Editează produs
        </h1>
        <p className="mt-0.5 text-sm text-stone-500">{product.name}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-6">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Denumire produs <span className="text-gold-500">*</span>
            <span className="ml-2 text-xs font-normal text-stone-400">(afișat bold pe site)</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) =>
              setForm((p) => ({ ...p, name: e.target.value.replace(/[0-9]/g, "") }))
            }
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-base font-bold text-stone-900 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Categorie <span className="text-gold-500">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((p) => ({ ...p, category: e.target.value }))
            }
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-base outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
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
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-base outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
          />
        </div>

        {/* Price + Discount */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">
              Preț <span className="text-gold-500">*</span>{" "}
              <span className="text-xs font-normal text-stone-400">(lei)</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              required
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: e.target.value.replace(/\D/g, "") }))
              }
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-base outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">
              Reducere{" "}
              <span className="text-xs font-normal text-stone-400">(%, opțional)</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={form.discountPct}
              onChange={(e) =>
                setForm((p) => ({ ...p, discountPct: e.target.value.replace(/\D/g, "") }))
              }
              placeholder="Ex: 15"
              className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-base outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
            />
          </div>
        </div>

        {discountedPrice !== null && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">
              Preț după reducere de <strong>{discountPct}%</strong>:{" "}
              <strong className="text-base text-emerald-900">
                {discountedPrice.toLocaleString("ro-RO")} lei
              </strong>
            </p>
            <p className="mt-1 text-xs text-emerald-600">
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
            className="w-full resize-none rounded-lg border border-stone-200 bg-white px-4 py-3 text-base outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
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
            placeholder="Ex: 100×50×30 cm"
            className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-base outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
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
            className="h-4 w-4 rounded border-stone-300 accent-stone-900"
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

          {allImages.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {allImages.map((img, i) => (
                <div key={i} className="group relative">
                  <div
                    className={`relative aspect-square overflow-hidden rounded-lg bg-stone-100 ring-2 transition-all ${
                      i === 0 ? "ring-gold-400" : "ring-transparent"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="150px"
                      unoptimized={img.url.startsWith("/uploads/") || img.url.startsWith("blob:")}
                    />
                    {i === 0 && (
                      <div className="absolute bottom-1 left-1 rounded bg-gold-500/90 px-1.5 py-0.5 text-xs font-semibold text-white">
                        Principal
                      </div>
                    )}
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => setPrimary(i)}
                        className="absolute inset-0 flex items-end justify-start p-1 opacity-0 transition-opacity group-hover:opacity-100"
                        title="Setează ca imagine principală"
                      >
                        <span className="rounded bg-stone-900/80 px-1.5 py-0.5 text-xs font-medium text-white">
                          Principal
                        </span>
                      </button>
                    )}
                    {!img.isExisting && (
                      <span className="absolute right-1 top-1 rounded bg-stone-900/70 px-1.5 py-0.5 text-xs text-white">
                        Nou
                      </span>
                    )}
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
            Adaugă imagini noi
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
            className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Anulează
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-1 rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
          >
            {uploading
              ? "Se încarcă imaginile..."
              : saving
              ? "Se salvează..."
              : "Salvează modificările"}
          </button>
        </div>
      </form>
    </div>
  );
}
