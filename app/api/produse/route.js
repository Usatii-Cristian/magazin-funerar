import { NextResponse } from "next/server";
import { products } from "@/lib/data";

export async function GET() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (dbProducts.length > 0) {
      return NextResponse.json(dbProducts);
    }
  } catch {
    // DB not connected — fall back to static data
  }

  return NextResponse.json(products);
}
