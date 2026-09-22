"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import type { CartTotal } from "@/types";
import AddToCartProduct from "./AddToCartProduct";
import CartSidebar from "./CartSidebar";
import { Card } from "@/components/ui/card";

export default function CartPage() {
  const { cart } = useStore();
  const [lastChange, setLastChange] = useState<CartTotal | null>(null);

  return (
    <div className="py-5">
      <div className="container">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Card className="bg-white p-[30px]">
              <h2 className="mb-3 text-[25px] font-semibold">Cart</h2>
              <div className="overflow-x-auto">
                {cart.length === 0 ? (
                  <p className="py-6 text-center text-neutral-500">
                    Product Not Added In Cart
                  </p>
                ) : (
                  <table className="w-full border-collapse border text-sm">
                    <thead>
                      <tr className="bg-neutral-50">
                        <th className="border p-3 text-left">Product</th>
                        <th className="border p-3 text-left">Image</th>
                        <th className="border p-3 text-left">Price</th>
                        <th className="border p-3 text-left">Stock Status</th>
                        <th className="border p-3 text-left">Quantity</th>
                        <th className="border p-3 text-left">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((elem) => (
                        <tr key={elem.id}>
                          <AddToCartProduct cartProduct={elem} onQuantityChange={setLastChange} />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>
          <div className="lg:col-span-4">
            <CartSidebar cartDetails={lastChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
