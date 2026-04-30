"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BlogForm({ post }) {
  const isEdit = !!post;
  const router = useRouter();

  const [form, setForm] = useState({
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    coverImage: post?.coverImage ?? "",
    published: post?.published ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function field(key) {
    return (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          coverImage: form.coverImage.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Eroare (${res.status})`);
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-base outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20";

  return (
    <div>
      <div className="mb-8">
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="mb-4 flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-800"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Înapoi la blog
        </button>
        <h1 className="font-display text-2xl font-semibold text-stone-900">
          {isEdit ? "Editează articol" : "Articol nou"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="max-w-3xl space-y-6">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Titlu <span className="text-gold-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={field("title")}
            placeholder="Ex: Cum alegem un monument funerar potrivit"
            className={inputCls}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Rezumat{" "}
            <span className="text-xs font-normal text-stone-400">(afișat pe lista de blog)</span>
          </label>
          <textarea
            rows={2}
            value={form.excerpt}
            onChange={field("excerpt")}
            placeholder="Câteva propoziții despre subiectul articolului..."
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Cover image URL */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            URL imagine copertă{" "}
            <span className="text-xs font-normal text-stone-400">(opțional)</span>
          </label>
          <input
            type="url"
            value={form.coverImage}
            onChange={field("coverImage")}
            placeholder="https://..."
            className={inputCls}
          />
        </div>

        {/* Content */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Conținut <span className="text-gold-500">*</span>
            <span className="ml-2 text-xs font-normal text-stone-400">(HTML sau text simplu)</span>
          </label>
          <textarea
            required
            rows={20}
            value={form.content}
            onChange={field("content")}
            placeholder="Scrieți conținutul articolului..."
            className={`${inputCls} resize-y font-mono text-sm leading-relaxed`}
          />
        </div>

        {/* Published */}
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
            className="h-4 w-4 rounded border-stone-300 accent-stone-900"
          />
          <span className="text-sm text-stone-700">
            Publicat{" "}
            <span className="text-stone-400">
              (vizibil pe site; nebifat = ciornă)
            </span>
          </span>
        </label>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="rounded-lg border border-stone-200 px-5 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
          >
            Anulează
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:opacity-60"
          >
            {saving ? "Se salvează..." : isEdit ? "Actualizează articolul" : "Publică articolul"}
          </button>
        </div>
      </form>
    </div>
  );
}
