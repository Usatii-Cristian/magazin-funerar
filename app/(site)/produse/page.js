import { getProducts } from "@/lib/db";
import ProductsClient from "./ProductsClient";

export const revalidate = 60;

export const metadata = {
  title: "Monumente Funerare Granit și Marmură — Prețuri de la 2.800 lei | Moldova",
  description:
    "Catalog monumente funerare din granit și marmură: standart, duble, VIP, cruci, sicrie, coroane. Prețuri de la 2.800 lei, gravuri foto incluse, montaj în toată Moldova.",
  keywords: ["monumente funerare granit", "monument funerar preț", "cruce granit", "sicrie lemn", "coroane funerare Moldova", "monument funerar la comandă"],
  alternates: { canonical: "/produse" },
  openGraph: {
    title: "Monumente Funerare Granit & Marmură de la 2.800 lei | GranitNord Elit CV",
    description:
      "Catalog complet: monumente granit, cruci, sicrie, coroane. Prețuri de la 2.800 lei, gravuri foto, montaj profesionist în toată Moldova.",
    url: "/produse",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Monumente funerare GranitNord" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Monumente Funerare Granit & Marmură de la 2.800 lei",
    description: "Catalog complet: monumente granit, cruci, sicrie, coroane. Prețuri de la 2.800 lei, montaj în toată Moldova.",
    images: ["/og-image.jpg"],
  },
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
