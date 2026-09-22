"use client";

import { Trash2, ShoppingCart } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";

export default function WishProduct() {
  const { wishlist, setWishlist, cart, setCart } = useStore();

  const addToCart = (id: number) => {
    const elem = wishlist.find((item) => item.id === id);
    if (!elem) return;
    setCart([...cart.filter((item) => item.id !== elem.id), elem]);
  };

  const removeItem = (id: number) => {
    setWishlist(wishlist.filter((elem) => elem.id !== id));
  };

  if (wishlist.length === 0) {
    return (
      <div className="mb-[25px] bg-white p-[30px] text-center text-neutral-500">
        No products in wishlist.
      </div>
    );
  }

  return (
    <div className="mb-[25px] bg-white p-[30px]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border">
              {["Product Name", "Image", "Unit Price", "Stock Status", "Add to Cart", "Delete"].map((h) => (
                <th key={h} className="border p-[12px] align-middle">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {wishlist.map((elem) => (
              <tr key={elem.id} className="border">
                <td className="border p-[12px] align-top">{elem.title.substring(0, 20)}</td>
                <td className="border p-[12px] align-top">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="h-[70px] w-[70px] object-contain" src={elem.image} alt={elem.title} />
                </td>
                <td className="border p-[12px] align-top">${elem.price}</td>
                <td className="border p-[12px] align-top">In stock</td>
                <td className="border p-[12px] align-top">
                  <Button variant="ghost" size="sm" className="font-semibold text-[#6BB42F]" onClick={() => addToCart(elem.id)}>
                    <ShoppingCart className="mr-1 h-4 w-4" /> Add to cart
                  </Button>
                </td>
                <td className="border p-[12px] align-top">
                  <button onClick={() => removeItem(elem.id)} aria-label="Remove" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
