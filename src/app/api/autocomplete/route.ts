import { NextRequest, NextResponse } from "next/server";
import { autocomplete } from "@/lib/elasticsearch";
import { autocompleteSchema } from "@/lib/validation/autocompleteSchema";

export async function GET(req: NextRequest) {
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

  try {
    const suggestions = await autocomplete(q);
    return NextResponse.json(suggestions);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
