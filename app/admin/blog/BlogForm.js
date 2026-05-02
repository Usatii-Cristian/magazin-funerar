"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Strip the HTML the public site stores back into plain text + light markdown,
// so admins editing an existing post don't see raw <h2> tags.
function htmlToPlain(input) {
  if (!input) return "";
  if (!/<\w+[^>]*>/.test(input)) return input;

  let s = input;
  s = s.replace(/\r/g, "");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n## ${t.trim()}\n\n`);
  s = s.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n### ${t.trim()}\n\n`);
  s = s.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n#### ${t.trim()}\n\n`);
  s = s.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**");
  s = s.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**");
  s = s.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*");
  s = s.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*");
  s = s.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${t.trim()}\n`);
  s = s.replace(/<\/?(?:ul|ol)[^>]*>/gi, "\n");
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => `${t.trim()}\n\n`);
  s = s.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, t) =>
    t.trim().split("\n").map((l) => `> ${l}`).join("\n") + "\n\n"
  );
  s = s.replace(/<[^>]+>/g, "");
  s = s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  s = s.replace(/\n{3,}/g, "\n\n").trim();
  return s;
}

const TOOLBAR = [
  { label: "Titlu", insert: (sel) => `\n## ${sel || "Titlu"}\n\n` },
  { label: "Subtitlu", insert: (sel) => `\n### ${sel || "Subtitlu"}\n\n` },
  { label: "B", title: "Bold", insert: (sel) => `**${sel || "text îngroșat"}**` },
  { label: "I", title: "Italic", insert: (sel) => `*${sel || "text înclinat"}*` },
  { label: "Listă", insert: (sel) => (sel || "punct 1\npunct 2").split("\n").map((l) => `- ${l}`).join("\n") + "\n" },
  { label: "Link", insert: (sel) => `[${sel || "text link"}](https://...)` },
  { label: "Citat", insert: (sel) => `> ${sel || "citat"}\n\n` },
];

export default function BlogForm({ post }) {
  const isEdit = !!post;
  const router = useRouter();
  const textareaRef = useRef(null);

  const [form, setForm] = useState(() => ({
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    content: htmlToPlain(post?.content ?? ""),
    coverImage: post?.coverImage ?? "",
    published: post?.published ?? false,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function field(key) {
    return (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  }

  function applyToolbar(builder) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? 0;
    const before = form.content.slice(0, start);
    const selected = form.content.slice(start, end);
    const after = form.content.slice(end);
    const inserted = builder(selected);
    const next = before + inserted + after;
    setForm((p) => ({ ...p, content: next }));
    requestAnimationFrame(() => {
      ta.focus();
      const pos = before.length + inserted.length;
      ta.setSelectionRange(pos, pos);
    });
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
            <span className="text-xs font-normal text-stone-400">— afișat pe lista de blog</span>
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
            <span className="text-xs font-normal text-stone-400">— opțional</span>
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
            Conținut articol <span className="text-gold-500">*</span>
          </label>
          <p className="mb-2 text-xs leading-relaxed text-stone-500">
            Scrieți textul normal — separați paragrafele cu o linie goală. Folosiți
            butoanele de mai jos pentru titluri, listă, bold, link.
          </p>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {TOOLBAR.map((btn) => (
              <button
                key={btn.label}
                type="button"
                title={btn.title || btn.label}
                onClick={() => applyToolbar(btn.insert)}
                className="rounded-md border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:border-gold-400 hover:bg-gold-50"
              >
                {btn.label}
              </button>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            required
            rows={20}
            value={form.content}
            onChange={field("content")}
            placeholder={`Scrieți articolul aici, ca un text normal.\n\nDouă linii goale = paragraf nou.\n\n## Folosiți două diez pentru un titlu\n\n**bold** și *italic* la nevoie.`}
            className={`${inputCls} resize-y text-base leading-relaxed`}
          />
        </div>

        {/* Published */}
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
              className="mt-0.5 h-4 w-4 rounded border-stone-300 accent-stone-900"
            />
            <span className="flex flex-col text-sm">
              <span className="font-semibold text-stone-800">
                Publică articolul pe site
              </span>
              <span className="text-stone-500">
                {form.published
                  ? "Articolul va fi vizibil pentru vizitatori imediat după salvare."
                  : "Articolul rămâne salvat dar nu apare pe site până nu este publicat."}
              </span>
            </span>
          </label>
        </div>

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
            {saving ? "Se salvează..." : isEdit ? "Actualizează articolul" : form.published ? "Publică articolul" : "Salvează articolul"}
          </button>
        </div>
      </form>
    </div>
  );
}
