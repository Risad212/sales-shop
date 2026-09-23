"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { useStore } from "@/context/StoreContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  item: Product;
}

export default function ProductCard({ item }: ProductCardProps) {
  const { cart, setCart, wishlist, setWishlist } = useStore();
  const [saved, setSaved] = useState(false);

  const addToCart = () => {
    setCart([...cart.filter((elem) => elem.id !== item.id), item]);
  };

  const toggleWishlist = () => {
    if (wishlist.some((elem) => elem.id === item.id)) {
      setWishlist(wishlist.filter((elem) => elem.id !== item.id));
      setSaved(false);
    } else {
      setWishlist([...wishlist, item]);
      setSaved(true);
    }
  };

  return (
    <Card className="h-full p-4 text-center shadow-[0_3px_10px_rgba(146,146,146,0.2)]">
      <Link href={`/product/${item.id}`}>
        <div className="relative h-[200px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>
      </Link>
      <CardContent className="space-y-1 p-2">
        <h5 className="font-bold" title={item.title}>
          {item.title.substring(0, 24)}
        </h5>
        <p className="font-bold leading-6">${item.price}</p>
        {item.ageGroup && item.ageGroup !== "all" && (
          <span className="inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium capitalize text-neutral-600">
            {item.ageGroup}
          </span>
        )}
      </CardContent>
      <CardFooter className="justify-center gap-0 p-2">
        <Button variant="outline" size="sm" className="rounded-r-none" onClick={addToCart}>
          <ShoppingCart className="mr-1 h-4 w-4" /> Add To Cart
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-l-none border-l-0"
          onClick={toggleWishlist}
          aria-label="Toggle wishlist"
        >
          <Heart className={cn("h-4 w-4", saved && "fill-red-500 text-red-500")} />
        </Button>
      </CardFooter>
    </Card>
  );
}
