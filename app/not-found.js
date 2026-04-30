import Link from "next/link";

// Standalone fallback (no site chrome) for paths outside the (site) group.
// The branded version with Navbar / Footer / sticky contact lives in
// app/(site)/not-found.js — that's what visitors normally see.

export const metadata = {
  title: "Pagina nu a fost găsită",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-6">
      <div className="mx-auto max-w-lg text-center">
        <p className="font-display text-7xl font-semibold text-gold-500 sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-stone-900 sm:text-3xl">
          Pagina nu a fost găsită
        </h1>
        <p className="mt-3 text-stone-500">
          Pagina pe care o căutați nu există sau a fost mutată.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-gold-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-gold-600"
        >
          Pagina principală
        </Link>
      </div>
    </div>
  );
}
