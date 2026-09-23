import type { z } from "zod";
import type {
  AgeGroupSchema,
  ProductSchema,
  RatingSchema,
} from "@/lib/schemas";

// Single source of truth lives in src/lib/schemas.ts (zod) — these types
// can never drift from the runtime validators.
export type AgeGroup = z.infer<typeof AgeGroupSchema>;
export type Rating = z.infer<typeof RatingSchema>;
export type Product = z.infer<typeof ProductSchema>;

export interface Category {
  category: string;
  title: string;
  img: string;
}

export interface CartTotal {
  amount: number;
  sign: "plus" | "minus" | null;
}
