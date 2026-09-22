"use client";

import Link from "next/link";
import { Search, CalendarDays } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { BlogData } from "@/fakeData/fake-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["Men", "Women", "Jewellery", "Electronics"];

export default function BlogSidebar() {
  const { searchQuery, setSearchQuery } = useStore();

  return (
    <div className="mb-[40px] border bg-white p-[30px]">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="button" size="icon" variant="brand" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="popularPost mt-[5px]">
        <h3 className="relative border bg-[#fafafa] py-2 text-center text-[16px] font-medium">
          Popular Post
        </h3>
        <div className="mt-3">
          {BlogData.map((elem) => (
            <div key={elem.title}>
              <div className="mb-3 grid grid-cols-12 gap-2">
                <div className="col-span-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={elem.img} className="w-full object-cover" alt={elem.title} loading="lazy" />
                </div>
                <div className="col-span-8">
                  <h5 className="cursor-pointer text-[14px] text-[#333]">
                    {elem.title.substring(0, 40)}
                  </h5>
                  <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(elem.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <hr className="my-2" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-2 text-center text-[16px] font-medium">CATEGORIES</h3>
        <ul>
          {CATEGORIES.map((cat) => (
            <li key={cat} className="border-b border-dotted px-2 py-2">
              <Link className="cursor-pointer text-sm" href="/shop">
                ✜ {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
