"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  {
    href: "/admin/produse",
    label: "Produse",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    href: "/admin/mesaje",
    label: "Mesaje",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
];

export default function AdminSidebar({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    onClose?.();
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function handleNavClick() {
    onClose?.();
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-stone-900 text-white">
      <div className="flex items-center justify-between border-b border-stone-700 p-6">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone-400">
            Admin
          </p>
          <h1 className="font-display text-lg font-semibold text-white">
            PrimNord Granit
          </h1>
        </div>
        {/* Close button visible only on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white md:hidden"
            aria-label="Închide"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (typeof pathname === "string" && pathname.startsWith(link.href + "/"));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-stone-800 text-white"
                  : "text-stone-400 hover:bg-stone-800 hover:text-white"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-stone-700 p-4">
        <Link
          href="/"
          target="_blank"
          onClick={handleNavClick}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-stone-400 transition-colors hover:bg-stone-800 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          Deschide site-ul
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-stone-400 transition-colors hover:bg-red-900/40 hover:text-red-300"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Deconectare
        </button>
      </div>
    </aside>
  );
}
