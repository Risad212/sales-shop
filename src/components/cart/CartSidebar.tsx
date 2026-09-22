"use client";

import { useEffect, useState } from "react";
import type { CartTotal } from "@/types";
import { useStore } from "@/context/StoreContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartSidebarProps {
  cartDetails?: CartTotal | null;
}

const SHIPPING_PER_ITEM = 15;

export default function CartSidebar({ cartDetails }: CartSidebarProps) {
  const { cart } = useStore();
  const [subTotal, setSubTotal] = useState(0);
  const [adjustment, setAdjustment] = useState(0);

  useEffect(() => {
    setSubTotal(Math.floor(cart.reduce((sum, item) => sum + item.price, 0)));
  }, [cart]);

  useEffect(() => {
    if (!cartDetails?.sign) return;
    if (cartDetails.sign === "plus") {
      setSubTotal((prev) => prev + cartDetails.amount);
      setAdjustment((prev) => prev + 1);
    } else {
      setSubTotal((prev) => prev - cartDetails.amount);
      setAdjustment((prev) => prev - 1);
    }
  }, [cartDetails]);

  const shipping = cart.length * SHIPPING_PER_ITEM + adjustment * SHIPPING_PER_ITEM;
  const total = subTotal + Math.max(shipping, 0);

  return (
    <Card className="bg-white">
      <CardContent className="space-y-3 p-6">
        <h2 className="mb-4 text-[24px] font-medium">Order Summary</h2>
        <div className="flex justify-between text-[16px]">
          <span>Subtotal:</span>
          <span className="font-semibold">${subTotal}</span>
        </div>
        <div className="flex justify-between text-[16px]">
          <span>Shipping:</span>
          <span className="font-semibold">${Math.max(shipping, 0)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-[18px] font-semibold">
          <span>Total:</span>
          <span>${cart.length > 0 ? total : 0}</span>
        </div>
        <Button variant="brand" className="mt-4 w-full">
          Checkout
        </Button>
      </CardContent>
    </Card>
  );
}
