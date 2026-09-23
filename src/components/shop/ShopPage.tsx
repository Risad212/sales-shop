"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import ProductFilter from "./ProductFilter";
import ShopProduct from "./ShopProduct";
import { ProductsApiResponseSchema } from "@/lib/schemas";

export default function ShopPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [allItems, setAllItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getItems = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products?limit=50");
        const data: unknown = await res.json();
        const parsed = ProductsApiResponseSchema.safeParse(data);
        const list = parsed.success ? parsed.data.products : [];
        setItems(list);
        setAllItems(list);
      } catch {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    getItems();
  }, []);

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeAge, setActiveAge] = useState("all");
  const [searchText, setSearchText] = useState("");

  const applyFilters = (category: string, age: string, text: string) => {
    setItems(
      allItems.filter((item) => {
        if (category !== "all" && item.category !== category) return false;
        if (age !== "all" && item.ageGroup !== age && item.ageGroup !== "all") return false;
        if (text && !item.title.toLowerCase().includes(text)) return false;
        return true;
      })
    );
  };

  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    applyFilters(category, activeAge, searchText);
  };

  const filterByAge = (age: string) => {
    setActiveAge(age);
    applyFilters(activeCategory, age, searchText);
  };

  const filterBySearch = (text: string) => {
    setSearchText(text);
    applyFilters(activeCategory, activeAge, text);
  };

  const clearAll = () => {
    setActiveCategory("all");
    setActiveAge("all");
    setSearchText("");
    setItems(allItems);
  };

  return (
    <div className="container my-5">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 xl:col-span-3">
          <ProductFilter
            onCategory={filterByCategory}
            onAge={filterByAge}
            onSearch={filterBySearch}
            onClear={clearAll}
          />
        </div>
        <div className="lg:col-span-8 xl:col-span-9">
          <ShopProduct products={items} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
