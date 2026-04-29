"use client";

import { useEffect, useState } from "react";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", message: "", hp: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    if (typeof window === "undefined") return;
    if (document.querySelector(`script[data-recaptcha]`)) return;
    const s = document.createElement("script");
    s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    s.async = true;
    s.defer = true;
    s.dataset.recaptcha = "1";
    document.head.appendChild(s);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    let filtered = value;
    if (name === "name") filtered = value.replace(/[0-9]/g, "");
    if (name === "phone") filtered = value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, [name]: filtered }));
  }

  async function getRecaptchaToken() {
    if (!RECAPTCHA_SITE_KEY) return null;
    if (typeof window === "undefined" || !window.grecaptcha) return null;
    return new Promise((resolve) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "contact" });
          resolve(token);
        } catch {
          resolve(null);
        }
      });
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const recaptchaToken = await getRecaptchaToken();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });
      if (res.status === 429) {
        setErrorMsg("Prea multe mesaje într-un timp scurt. Reveniți peste un minut.");
        setStatus("error");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "A apărut o eroare. Încercați din nou.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm({ name: "", phone: "", message: "", hp: "" });
    } catch {
      setErrorMsg("A apărut o eroare. Vă rugăm să încercați din nou.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-stone-50 p-10 text-center ring-1 ring-stone-100">
        <svg
          className="mx-auto mb-4 h-12 w-12 text-gold-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="font-display text-xl font-semibold text-stone-900">
          Mesaj trimis
        </h3>
        <p className="mt-2 text-sm text-stone-500">
          Vă vom contacta cât mai curând posibil.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-gold-600 underline underline-offset-4"
        >
          Trimite alt mesaj
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl bg-white p-8 shadow-sm ring-1 ring-stone-100"
    >
      {/* Honeypot — invisible to humans, filled by bots */}
      <div className="hidden" aria-hidden="true">
        <label>
          Nu completați acest câmp
          <input
            type="text"
            name="hp"
            tabIndex={-1}
            autoComplete="off"
            value={form.hp}
            onChange={handleChange}
          />
        </label>
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-stone-700">
          Nume complet <span className="text-gold-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          value={form.name}
          onChange={handleChange}
          placeholder="Introduceți numele"
          className="w-full cursor-text caret-stone-900 rounded-lg border border-stone-200 bg-cream-50 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-stone-700">
          Telefon <span className="text-gold-500">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          inputMode="numeric"
          required
          maxLength={30}
          value={form.phone}
          onChange={handleChange}
          placeholder="Ex: 07XX XXX XXX"
          className="w-full cursor-text caret-stone-900 rounded-lg border border-stone-200 bg-cream-50 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-stone-700">
          Mesaj <span className="text-gold-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={2000}
          value={form.message}
          onChange={handleChange}
          placeholder="Descrieți pe scurt situația sau întrebarea dumneavoastră..."
          className="w-full cursor-text caret-stone-900 resize-none rounded-lg border border-stone-200 bg-cream-50 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
        />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMsg || "A apărut o eroare. Vă rugăm să încercați din nou sau să ne sunați direct."}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-gold-500 py-3.5 text-sm font-medium text-white transition-colors hover:bg-gold-600 disabled:opacity-60"
      >
        {status === "loading" ? "Se trimite..." : "Trimite mesajul"}
      </button>

      <p className="text-center text-xs text-stone-400">
        {RECAPTCHA_SITE_KEY ? (
          <>
            Acest site este protejat de reCAPTCHA și se aplică{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
              Politica de confidențialitate
            </a>{" "}
            și{" "}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
              Termenii Google
            </a>
            .
          </>
        ) : (
          "Vom răspunde în cel mai scurt timp posibil."
        )}
      </p>
    </form>
  );
}
