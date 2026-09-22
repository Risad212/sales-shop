import { NextRequest, NextResponse } from "next/server";
import { queryProducts, getCategories, activeSource } from "@/lib/products";

// Reads search params from the request — never prerender statically.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") ?? undefined;
    const ageGroup = searchParams.get("ageGroup") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const limit = searchParams.get("limit");

    if (category === "__categories") {
      return NextResponse.json({ categories: await getCategories() });
    }

    const products = await queryProducts({
      category,
      ageGroup,
      search,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return NextResponse.json({ products, source: activeSource() });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
