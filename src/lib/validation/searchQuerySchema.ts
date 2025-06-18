import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().optional().default(""),
  vendor: z.string().optional(),
  productType: z.string().optional(),
  minPrice: z.preprocess(
    (val) =>
      typeof val === "string" && val !== "" ? parseFloat(val) : undefined,
    z.number().optional()
  ),
  maxPrice: z.preprocess(
    (val) =>
      typeof val === "string" && val !== "" ? parseFloat(val) : undefined,
    z.number().optional()
  ),
  status: z.enum(["active", "draft", "archived"]).optional(),
  tag: z.string().optional(),
  sort: z
    .enum(["relevance", "createdAt", "price", "title"])
    .optional()
    .default("relevance"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.preprocess(
    (val) =>
      typeof val === "string" && val !== "" ? parseInt(val, 10) : undefined,
    z.number().int().min(1).optional().default(1)
  ),
  size: z.preprocess(
    (val) =>
      typeof val === "string" && val !== "" ? parseInt(val, 10) : undefined,
    z.number().int().min(1).optional().default(10)
  ),
});
