import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import EditProductForm from "./EditProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }) {
  const { id } = await params;

  let product = null;
  try {
    product = await prisma.product.findUnique({ where: { id } });
  } catch (err) {
    console.error("Edit product fetch failed:", err.message);
  }

  if (!product) notFound();

  return (
    <EditProductForm
      product={JSON.parse(JSON.stringify(product))}
    />
  );
}
