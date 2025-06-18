import { NextRequest, NextResponse } from "next/server";
import { searchQuerySchema } from "@/lib/validation/searchQuerySchema";
import { searchProducts } from "@/lib/elasticsearch";
import { buildFilters } from "@/lib/utils";
import { Sort } from "@/types/search";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params = Object.fromEntries(searchParams.entries());

  const result = searchQuerySchema.safeParse(params);
  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const { q, sort, order, page, size, ...rest } = result.data;
  const filters = buildFilters(rest);
  const sortOptions: Sort = {
    field: sort,
    order: order,
  };
  const from = (page - 1) * size;

  try {
    const data = await searchProducts(q, filters, sortOptions, from, size);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message || error.name
        : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
