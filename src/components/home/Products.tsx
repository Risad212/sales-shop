"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/common/SectionHeading";
import ProductSkeleton from "@/components/common/ProductSkeleton";
import { ProductsApiResponseSchema } from "@/lib/schemas";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products?limit=8");
        const data: unknown = await res.json();
        const parsed = ProductsApiResponseSchema.safeParse(data);
        setProducts(parsed.success ? parsed.data.products : []);
      } catch {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  return (
    <div className="mb-[5rem] mt-[3rem]">
      <div className="container">
        <SectionHeading title="Featured Products" />
        {isLoading ? (
          <ProductSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard item={product} key={product.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
