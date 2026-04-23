import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import DeleteProductButton from "./DeleteProductButton";

function fmt(n) {
  return n.toLocaleString("ro-RO") + " lei";
}

export default async function AdminProductsPage() {
  let products = [];
  try {
    products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  } catch {}

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-stone-900">
            Produse
          </h1>
          <p className="mt-0.5 text-sm text-stone-500">
            {products.length} produse în baza de date
          </p>
        </div>
        <Link
          href="/admin/produse/nou"
          className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Adaugă produs
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-white py-20 text-center">
          <p className="text-stone-500 mb-4">
            Nu există produse în baza de date.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/admin/produse/nou"
              className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800"
            >
              Adaugă primul produs
            </Link>
            <SeedButton />
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-100">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Produs
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Categorie
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Preț
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Recomandat
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {products.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {p.images?.[0] ? (
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={p.images[0]}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                            unoptimized={p.images[0].startsWith("/uploads/")}
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 shrink-0 rounded-lg bg-stone-100" />
                      )}
                      <div>
                        <p className="font-semibold text-stone-900 text-sm">
                          {p.name}
                        </p>
                        <p className="text-xs text-stone-400">{p.material}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-stone-600">{p.category}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-stone-900 text-sm">
                      {fmt(p.price)}
                    </span>
                    {p.originalPrice && (
                      <span className="ml-2 text-xs text-stone-400 line-through">
                        {fmt(p.originalPrice)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {p.featured ? (
                      <span className="inline-flex items-center rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-medium text-gold-700">
                        Da
                      </span>
                    ) : (
                      <span className="text-xs text-stone-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/produse/${p.id}`}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-stone-600 ring-1 ring-stone-200 transition-colors hover:ring-stone-400"
                      >
                        Editează
                      </Link>
                      <DeleteProductButton
                        productId={p.id}
                        productName={p.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SeedButton() {
  return (
    <form
      action={async () => {
        "use server";
        const { default: prisma } = await import("@/lib/prisma");
        const bcrypt = (await import("bcryptjs")).default;
        const { products: staticProducts } = await import("@/lib/data");

        const existing = await prisma.admin.findUnique({
          where: { email: "cristiusa98@gmail.com" },
        });
        if (!existing) {
          const passwordHash = await bcrypt.hash("smecherul1", 12);
          await prisma.admin.create({
            data: { email: "cristiusa98@gmail.com", passwordHash },
          });
        }

        const count = await prisma.product.count();
        if (count === 0) {
          await prisma.product.createMany({
            data: staticProducts.map((p) => ({
              name: p.name,
              category: p.category,
              material: p.material || "Granit",
              price: p.price,
              originalPrice: p.originalPrice || null,
              images: [p.image],
              description: p.description,
              dimensions: null,
              featured: p.featured || false,
            })),
          });
        }
      }}
    >
      <button
        type="submit"
        className="text-sm text-stone-400 underline underline-offset-2 hover:text-stone-600"
      >
        Importă produse demo din catalog static
      </button>
    </form>
  );
}
