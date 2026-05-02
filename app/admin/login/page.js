"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function getSafeNextParam() {
  if (typeof window === "undefined") return null;
  try {
    const next = new URLSearchParams(window.location.search).get("next");
    return next && /^\/admin(\/|$)/.test(next) ? next : null;
  } catch {
    return null;
  }
}

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Eroare la autentificare");
      router.push(getSafeNextParam() || "/admin/produse");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gold-500">
            Panou administrare
          </p>
          <h1 className="font-display text-2xl font-semibold text-stone-900">
            PrimNord Granit
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="admin@example.com"
              className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">
              Parolă
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              placeholder="••••••••"
              className="w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-stone-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:opacity-60"
          >
            {loading ? "Se autentifică..." : "Autentificare"}
          </button>
        </form>
      </div>
    </div>
  );
}
