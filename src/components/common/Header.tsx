"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Heart, ShoppingCart, Phone, Mail } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/wishlist", label: "Wishlist" },
];

export default function Header() {
  const { cart, wishlist } = useStore();

  const totalPrice = useMemo(
    () => Math.floor(cart.reduce((sum, item) => sum + item.price, 0)),
    [cart]
  );

  return (
    <header>
      <div className="bg-[#6BB42F] py-[2px]">
        <div className="container flex flex-col items-center justify-between py-[5px] lg:flex-row">
          <div>
            <span className="ps-[10px] text-[14px] text-white">
              <Phone className="mr-1 inline h-3.5 w-3.5" /> 1-284-676-2886
            </span>
            <span className="ps-[10px] text-[14px] text-white">
              <Mail className="mr-1 inline h-3.5 w-3.5" /> info@salesshop.com
            </span>
          </div>
          <div className="text-[14px] text-white">Free shipping on orders over $50</div>
        </div>
      </div>

      <div className="border-b bg-white">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Sales<span className="text-[#6BB42F]">Shop</span>
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[15px] font-medium text-neutral-700 transition hover:text-[#6BB42F]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="brand" size="sm" className="hidden sm:inline-flex" asChild>
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Link href="/wishlist" className="relative p-1" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-[#6BB42F] p-0 text-[11px]">
                {wishlist.length}
              </Badge>
            </Link>
            <Link href="/cart" className="relative flex items-center gap-1 p-1" aria-label="Cart">
              <span className="text-sm font-semibold">${totalPrice.toFixed(2)}</span>
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-[#6BB42F] p-0 text-[11px]">
                {cart.length}
              </Badge>
            </Link>
          </div>
        </div>

        <nav className="container flex gap-4 overflow-x-auto pb-3 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
