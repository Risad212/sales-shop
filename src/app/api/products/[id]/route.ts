import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }
  try {
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    console.error(`GET /api/products/${id} failed:`, error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
