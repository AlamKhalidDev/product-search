import { z } from "zod";

export const autocompleteSchema = z.object({
  q: z
    .string()
    .optional()
    .transform((val) => val?.trim() ?? ""),
});
