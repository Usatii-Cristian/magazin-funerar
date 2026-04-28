import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import DeleteProductButton from "./DeleteProductButton";

export const dynamic = "force-dynamic";

function fmt(n) {
  return n.toLocaleString("ro-RO") + " lei";
}

export default async function AdminProductsPage() {
  let products = [];
  let dbError = null;
  try {
    products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err) {
    dbError = err.message || "Eroare la conectare cu baza de date";
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-stone-900 sm:text-2xl">
            Produse
          </h1>
          <p className="mt-0.5 text-sm text-stone-500">
            {products.length} produse în baza de date
          </p>
        </div>
        <Link
          href="/admin/produse/nou"
          className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden sm:inline">Adaugă produs</span>
          <span className="sm:hidden">Adaugă</span>
        </Link>
      </div>

      {dbError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Eroare la conectare cu baza de date:</p>
          <p className="mt-1 font-mono text-xs">{dbError}</p>
        </div>
      )}

      {products.length === 0 && !dbError ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-white py-20 text-center">
          <p className="text-stone-500 mb-4">Nu există produse în baza de date.</p>
          <Link
            href="/admin/produse/nou"
            className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800"
          >
            Adaugă primul produs
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => {
            const img = p.images?.[0] ?? "";
            const pct = p.originalPrice
              ? Math.round((1 - p.price / p.originalPrice) * 100)
              : null;
            return (
              <div
                key={p.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-100"
              >
                <div className="relative h-48 bg-stone-100">
                  {img ? (
                    <Image
                      src={img}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized={img.startsWith("/uploads/")}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-stone-300">
                      <svg className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M4.5 3h15A1.5 1.5 0 0121 4.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15A1.5 1.5 0 014.5 3z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-stone-900/20" />
                  <div className="absolute left-2 top-2 flex gap-1.5">
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-stone-700">
                      {p.category}
                    </span>
                    {pct && (
                      <span className="rounded bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                        -{pct}%
                      </span>
                    )}
                    {p.featured && (
                      <span className="rounded bg-gold-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                        ★
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-gold-500">
                    {p.material}
                  </p>
                  <h3 className="mt-1 font-display text-sm font-semibold text-stone-900 line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-400">
                    {p.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="font-display text-base font-semibold text-stone-900">
                      {fmt(p.price)}
                    </span>
                    {p.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        {fmt(p.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 border-t border-stone-100 px-4 py-3">
                  <Link
                    href={`/admin/produse/${p.id}`}
                    className="flex-1 rounded-lg bg-stone-100 py-2 text-center text-xs font-medium text-stone-700 transition-colors hover:bg-stone-200"
                  >
                    Editează
                  </Link>
                  <DeleteProductButton productId={p.id} productName={p.name} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
