"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { useStore } from "@/context/StoreContext";
import ProductSkeleton from "@/components/common/ProductSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductsApiResponseSchema } from "@/lib/schemas";

export default function ProductCollection() {
  const { cart, setCart } = useStore();
  const params = useParams<{ name: string }>();
  const name = params?.name ? decodeURIComponent(params.name) : "";
  const [collection, setCollection] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!name) return;
    const getCollection = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?category=${encodeURIComponent(name)}&limit=50`);
        const data: unknown = await res.json();
        const parsed = ProductsApiResponseSchema.safeParse(data);
        setCollection(parsed.success ? parsed.data.products : []);
      } catch {
        setCollection([]);
      } finally {
        setIsLoading(false);
      }
    };
    getCollection();
  }, [name]);

  const addToCart = (item: Product) => {
    setCart([...cart.filter((elem) => elem.id !== item.id), item]);
  };

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="pb-5 text-center text-[32px] font-bold capitalize md:text-[40px]">
          {name} Collection
        </h2>
        {isLoading ? (
          <ProductSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {collection.map((single) => (
              <Card key={single.id} className="p-4 text-center">
                <Link href={`/product/${single.id}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={single.image} alt={single.title} className="mx-auto h-[200px] object-contain" loading="lazy" />
                </Link>
                <CardContent className="space-y-1 p-2">
                  <h5 className="font-bold">{single.title.substring(0, 24)}</h5>
                  <p className="font-bold leading-6">${single.price}</p>
                  <Button variant="outline" size="sm" onClick={() => addToCart(single)}>
                    Add To Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
