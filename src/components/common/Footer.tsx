"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0e1418] py-16 text-white">
      <div className="container grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="mb-4 inline-block text-xl font-bold">
            Sales<span className="text-[#6BB42F]">Shop</span>
          </Link>
          <p className="text-sm text-[#afb4bf]">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt odio
            iure animi ullam quam, deleniti rem!
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-[18px] font-semibold">Quick Links</h4>
          <ul>
            {QUICK_LINKS.map((link) => (
              <li key={link.href} className="mb-[10px]">
                <Link href={link.href} className="text-[14px] text-[#afb4bf] hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[18px] font-semibold">Contact Info</h4>
          <ul className="space-y-2 text-[14px] text-[#afb4bf]">
            <li><strong>Address:</strong> 98 West 21th Street, Suite 721 New York NY 10016</li>
            <li><strong>Phone:</strong> (1) 284-676-2886</li>
            <li><strong>Email:</strong> info@yourdomain.com</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[18px] font-semibold">Newsletter</h4>
          <p className="mb-3 text-[14px] text-[#afb4bf]">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </p>
          <form className="relative flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              name="email"
              placeholder="Your Email Address"
              className="h-[46px] rounded-[30px] border-none bg-[#3e525f] px-[20px] text-[14px] text-white placeholder:text-[#afb4bf]"
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Subscribe"
              className="absolute right-[4px] top-[3px] h-[40px] w-[40px] rounded-full bg-[#6BB42F] hover:bg-[#5da128]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </footer>
  );
}
