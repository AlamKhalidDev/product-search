import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/db";
import { createIndex, indexProducts } from "@/lib/elastic";

export async function GET() {
  try {
    const products = getAllProducts();
    await createIndex();
    await indexProducts(products);
    return NextResponse.json({
      success: true,
      indexed: products.length,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
