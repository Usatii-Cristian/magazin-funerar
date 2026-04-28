import { getProducts } from "@/lib/db";
import ProductsClient from "./ProductsClient";

export const revalidate = 60;

export const metadata = {
  title: "Monumente Funerare — PrimNord Granit",
  description:
    "Monumente, cruci, sicrie și accesorii funerare din granit și marmură. Personalizate și montate profesionist.",
};

export default async function ProductsPage({ searchParams }) {
  const { categoria } = await searchParams;
  const products = await getProducts();

  return (
    <>
      {/* Page hero */}
      <section className="bg-stone-900 px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold-400">
            Granit & Marmură
          </p>
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">
            Monumente Funerare
          </h1>
          <p className="mt-5 text-base leading-relaxed text-stone-400">
            Fiecare monument este realizat cu atenție la detalii, din materiale
            de calitate superioară, pentru a onora memoria celor dragi.
          </p>
        </div>
      </section>

      <ProductsClient products={products} initialCategory={categoria || "Toate"} />
    </>
  );
}
