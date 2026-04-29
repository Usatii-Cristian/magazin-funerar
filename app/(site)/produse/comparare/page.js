import { getProducts } from "@/lib/db";
import CompareClient from "./CompareClient";

export const revalidate = 60;

export const metadata = {
  title: "Comparare produse — PrimNord Granit",
  description: "Comparați produsele alese, side by side.",
};

export default async function ComparePage() {
  const products = await getProducts();
  return <CompareClient products={products} />;
}
