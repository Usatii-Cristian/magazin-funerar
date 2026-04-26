"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Acasă" },
  { href: "/servicii", label: "Servicii" },
  { href: "/produse", label: "Monumente" },
  { href: "/despre", label: "Despre noi" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.svg"
            alt="PrimNord Granit"
            width={40}
            height={40}
            unoptimized
            className="md:hidden"
          />
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-wide text-stone-900">
              PrimNord
            </span>
            <span className="text-xs tracking-[0.2em] text-gold-500 uppercase">
              Granit
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                pathname === l.href
                  ? "font-medium text-gold-600 underline underline-offset-4 decoration-gold-400"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden rounded border border-gold-500 px-4 py-2 text-sm text-gold-600 transition-colors hover:bg-gold-500 hover:text-white md:block"
        >
          Contactați-ne
        </Link>

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-1.5 p-1 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Meniu"
        >
          <span
            className={`block h-0.5 w-6 bg-stone-700 transition-all ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-stone-700 transition-all ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-stone-700 transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-stone-100 bg-white px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`text-sm ${
                  pathname === l.href
                    ? "font-medium text-gold-600"
                    : "text-stone-600"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5 flex flex-col gap-2 border-t border-stone-100 pt-5">
            <a
              href="tel:079175383"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-gold-500 py-3 text-sm font-medium text-white hover:bg-gold-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              079 175 383
            </a>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-lg border border-stone-200 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Formular de contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
