import Link from "next/link";
import { companyInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-3 flex flex-col leading-none">
              <span className="font-display text-lg font-semibold text-white">
                PrimNord
              </span>
              <span className="text-xs tracking-[0.2em] text-gold-400 uppercase">
                Granit
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed">
              {companyInfo.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-300">
              Navigare
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/servicii", label: "Servicii" },
                { href: "/produse", label: "Monumente" },
                { href: "/despre", label: "Despre noi" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-stone-300">
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`tel:${companyInfo.phone}`}
                  className="transition-colors hover:text-white"
                >
                  {companyInfo.phone}
                </a>
              </li>
              <li className="text-stone-500">Disponibil 24/7</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-stone-800 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} PrimNord Granit. Toate drepturile
            rezervate.
          </p>
          <div className="flex gap-5">
            <Link href="/termeni" className="transition-colors hover:text-white">
              Termeni și condiții
            </Link>
            <Link href="/confidentialitate" className="transition-colors hover:text-white">
              Confidențialitate
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
