import { getProducts } from "@/lib/db";
import CompareClient from "./CompareClient";

export const revalidate = 60;

export const metadata = {
  title: "Comparare produse",
  description: "Comparați monumentele alese — material, dimensiuni și preț, una lângă alta.",
  alternates: { canonical: "/produse/comparare" },
  robots: { index: false, follow: true },
};

export default async function ComparePage() {
  const products = await getProducts();
  return <CompareClient products={products} />;
}
