/**
 * Runtime schemas for untyped boundaries (fetch JSON, JSON.parse, LLM output).
 * Rule: never `as`-cast external data — parse it with these schemas instead.
 */
import { z } from "zod";

export const AgeGroupSchema = z.enum(["kids", "teens", "adults", "seniors", "all"]);
export type AgeGroup = z.infer<typeof AgeGroupSchema>;

export const RatingSchema = z.object({
  rate: z.number(),
  count: z.number(),
});

/** A product as served by /api/products (unknown origin → validated). */
export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.string(),
  ageGroup: AgeGroupSchema,
  rating: RatingSchema,
});

/** GET /api/products → { products: Product[] }. */
export const ProductsApiResponseSchema = z.object({
  products: z.array(ProductSchema),
});

/** GET /api/products/[id] → { product: Product }. */
export const ProductApiResponseSchema = z.object({
  product: ProductSchema,
});

/** POST /api/chat → { reply, products }. Extra fields allowed. */
export const ChatApiResponseSchema = z.object({
  reply: z.string(),
  products: z.array(ProductSchema),
}).passthrough();

/** One entry of src/data/catalog.json. */
export const SnapshotItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.string(),
  ageGroup: z.string().optional(),
  ratingRate: z.number(),
  ratingCount: z.number(),
});
export const SnapshotSchema = z.array(SnapshotItemSchema);

/** Arguments the LLM may pass to the search_products tool. */
export const ToolArgsSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  ageGroup: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  limit: z.number().optional(),
});
export type ToolArgs = z.infer<typeof ToolArgsSchema>;

/** Minimal shape of an OpenAI-compatible chat-completion message. */
export const LlmMessageSchema = z.object({
  // Tool-call-only messages omit `content` entirely (not even null).
  content: z.string().nullable().optional(),
  tool_calls: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        function: z.object({
          name: z.string(),
          arguments: z.string(),
        }),
      })
    )
    .optional(),
});
export type LlmMessage = z.infer<typeof LlmMessageSchema>;

/** Minimal shape of an OpenAI-compatible embeddings response. */
export const EmbeddingsResponseSchema = z.object({
  data: z.array(z.object({ embedding: z.array(z.number()) })),
});

/** Minimal envelope of an OpenAI-compatible chat-completions response. */
export const ChatCompletionResponseSchema = z.object({
  choices: z.array(z.object({ message: LlmMessageSchema })).min(1),
});

/** Narrow an unknown age-group string to the app union (default "all"). */
export function parseAgeGroup(value: unknown): AgeGroup {
  const parsed = AgeGroupSchema.safeParse(value);
  return parsed.success ? parsed.data : "all";
}
