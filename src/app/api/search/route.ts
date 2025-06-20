import { NextRequest, NextResponse } from "next/server";
import { searchQuerySchema } from "@/lib/validation/searchQuerySchema";
import { searchProducts } from "@/lib/elasticsearch";
import { buildFilters } from "@/lib/utils";
import { Sort } from "@/types/search";
import { searchLimiter, handleRateLimitError } from "@/lib/rateLimiter";

export async function GET(req: NextRequest) {
  const identifier =
    req.headers.get("x-api-key") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    "anonymous";

  try {
    const rateLimitRes = await searchLimiter.consume(identifier);

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

    const data = await searchProducts(q, filters, sortOptions, from, size);

    return NextResponse.json(data, {
      headers: {
        "X-RateLimit-Limit": "15",
        "X-RateLimit-Remaining": rateLimitRes.remainingPoints.toString(),
        "X-RateLimit-Reset": Math.ceil(
          rateLimitRes.msBeforeNext / 1000
        ).toString(),
      },
    });
  } catch (error: any) {
    if (error instanceof Error) {
      const errorMessage = error.message || "An unknown error occurred";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    } else {
      return handleRateLimitError();
    }
  }
}
