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
    <header className="sticky top-0 z-50 bg-stone-950 shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)} className="shrink-0">
          <Image
            src="/logo.png"
            alt="PrimNord Granit"
            width={88}
            height={88}
            unoptimized
            className="rounded-sm"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative text-sm font-medium tracking-wide transition-colors ${
                pathname === l.href
                  ? "text-gold-400"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              {l.label}
              {pathname === l.href && (
                <span className="absolute -bottom-1 left-0 h-px w-full bg-gold-400" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop right: CTA */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/contact"
            className="rounded bg-gold-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gold-600"
          >
            Contactați-ne
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-1.5 p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Meniu"
        >
          <span className={`block h-0.5 w-6 bg-stone-300 transition-all ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-stone-300 transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-stone-300 transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-stone-800 bg-stone-900 px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-1 pt-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? "bg-stone-800 text-gold-400"
                    : "text-stone-300 hover:bg-stone-800 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5 flex flex-col gap-2 border-t border-stone-800 pt-5">
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
              className="flex items-center justify-center rounded-lg border border-stone-700 py-3 text-sm font-medium text-stone-300 hover:bg-stone-800"
            >
              Formular de contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
