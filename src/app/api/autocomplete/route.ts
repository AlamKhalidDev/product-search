import { NextRequest, NextResponse } from "next/server";
import { autocomplete } from "@/lib/elasticsearch";
import { autocompleteSchema } from "@/lib/validation/autocompleteSchema";
import { autocompleteLimiter, handleRateLimitError } from "@/lib/rateLimiter";

export async function GET(req: NextRequest) {
  const identifier =
    req.headers.get("x-api-key") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    "anonymous";

  try {
    const rateLimitRes = await autocompleteLimiter.consume(identifier);

    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());

    const result = autocompleteSchema.safeParse(params);
    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten() },
        { status: 400 }
      );
    }

    const { q } = result.data;
    if (!q) return NextResponse.json([], { status: 200 });

    const suggestions = await autocomplete(q);

    return NextResponse.json(suggestions, {
      headers: {
        "X-RateLimit-Limit": "30",
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
