"use client";

import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import type { Product, CartTotal } from "@/types";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";

interface AddToCartProductProps {
  cartProduct: Product;
  onQuantityChange: (total: CartTotal) => void;
}

export default function AddToCartProduct({ cartProduct, onQuantityChange }: AddToCartProductProps) {
  const { cart, setCart } = useStore();
  const [count, setCount] = useState(1);

  const removeItem = (id: number) => {
    setCart(cart.filter((elem) => elem.id !== id));
  };

  const decrement = () => {
    const next = count >= 2 ? count - 1 : count;
    setCount(next);
    onQuantityChange({ amount: Math.floor(cartProduct.price), sign: "minus" });
  };

  const increment = () => {
    setCount(count + 1);
    onQuantityChange({ amount: Math.floor(cartProduct.price), sign: "plus" });
  };

  return (
    <>
      <td className="border p-3">{cartProduct.title.substring(0, 20)}</td>
      <td className="border p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cartProduct.image} alt={cartProduct.title} className="h-[70px] w-[70px] object-contain" />
      </td>
      <td className="border p-3">${cartProduct.price}</td>
      <td className="border p-3">In Stock</td>
      <td className="border p-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={decrement} aria-label="Decrease">
            <Minus className="h-4 w-4" />
          </Button>
          <span className="flex h-10 w-10 items-center justify-center rounded-md border font-semibold">
            {count}
          </span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={increment} aria-label="Increase">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </td>
      <td className="border p-3">
        <button
          onClick={() => removeItem(cartProduct.id)}
          className="cursor-pointer text-red-500"
          aria-label="Remove item"
        >
          <X className="h-5 w-5" />
        </button>
      </td>
    </>
  );
}
