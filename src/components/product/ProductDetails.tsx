"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Product } from "@/types";
import { useStore } from "@/context/StoreContext";
import Rating from "./Rating";
import ProductSkeleton from "@/components/common/ProductSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductDetails() {
  const { cart, setCart } = useStore();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [item, setItem] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const getProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setItem(data.product as Product);
      } catch {
        setItem(null);
      } finally {
        setIsLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const addToCart = () => {
    if (!item) return;
    setCart([...cart.filter((elem) => elem.id !== item.id), item]);
  };

  if (isLoading) {
    return (
      <div className="container my-5">
        <ProductSkeleton count={1} />
      </div>
    );
  }

  if (!item) {
    return <div className="container my-10 text-center">Product not found.</div>;
  }

  return (
    <div className="container my-5">
      <div className="mt-5 grid gap-8 md:grid-cols-2">
        <div className="flex items-center justify-center rounded-lg border bg-white p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} className="max-h-[420px] w-auto object-contain" />
        </div>
        <div className="py-6">
          <Badge variant="secondary" className="mb-3">{item.category}</Badge>
          <h3 className="mb-2 text-2xl font-semibold">{item.title}</h3>
          <p className="mb-3 text-neutral-600">{item.description}</p>
          <span className="mb-3 block text-xl font-bold">${item.price}</span>
          <Rating value={item.rating?.rate} />
          <p className="mb-2 mt-2 text-sm text-neutral-500">
            {item.rating?.count} Customer Reviews
          </p>
          <Button variant="brand" className="mt-4" onClick={addToCart}>
            Add To Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
