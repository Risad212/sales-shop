"use client";

import React, { createContext, useContext, useState } from "react";
import type { Product } from "@/types";

interface StoreContextValue {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
  wishlist: Product[];
  setWishlist: React.Dispatch<React.SetStateAction<Product[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <StoreContext.Provider
      value={{ cart, setCart, wishlist, setWishlist, searchQuery, setSearchQuery }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

/** Legacy compat shape so old imports keep working during migration. */
export const StrogeData = StoreContext;
