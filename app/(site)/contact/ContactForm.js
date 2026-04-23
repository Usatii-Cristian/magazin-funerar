"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Eroare server");
      setStatus("success");
      setForm({ name: "", phone: "", message: "" });
    } catch {
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
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-stone-700">
          Nume complet <span className="text-gold-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Introduceți numele"
          className="w-full rounded-lg border border-stone-200 bg-cream-50 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-stone-700">
          Telefon <span className="text-gold-500">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          value={form.phone}
          onChange={handleChange}
          placeholder="Ex: 07XX XXX XXX"
          className="w-full rounded-lg border border-stone-200 bg-cream-50 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
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
          value={form.message}
          onChange={handleChange}
          placeholder="Descrieți pe scurt situația sau întrebarea dumneavoastră..."
          className="w-full resize-none rounded-lg border border-stone-200 bg-cream-50 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none transition-colors focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
        />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          A apărut o eroare. Vă rugăm să încercați din nou sau să ne sunați direct.
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
        Vom răspunde în cel mai scurt timp posibil.
      </p>
    </form>
  );
}
