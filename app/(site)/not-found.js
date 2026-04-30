import Link from "next/link";

export const metadata = {
  title: "Pagina nu a fost găsită",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-cream-50 px-6 py-20">
      <div className="mx-auto max-w-lg text-center">
        <p className="font-display text-7xl font-semibold text-gold-500 sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-stone-900 sm:text-3xl">
          Pagina nu a fost găsită
        </h1>
        <p className="mt-3 text-stone-500">
          Pagina pe care o căutați nu există sau a fost mutată. Vă rugăm să verificați adresa sau să reveniți la pagina principală.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-lg bg-gold-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-gold-600"
          >
            Pagina principală
          </Link>
          <Link
            href="/produse"
            className="rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400"
          >
            Vezi catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
