import { z } from 'zod';

const CATEGORY_NAME_REQUIRED_MESSAGE = 'Název kategorie je povinný.';
const MAX_CATEGORY_NAME_LENGTH = 100;
const CATEGORY_NAME_TOO_LONG_MESSAGE = `Název kategorie může mít nejvýše ${MAX_CATEGORY_NAME_LENGTH} znaků.`;

export const categoryNameSchema = z
  .string({ error: CATEGORY_NAME_REQUIRED_MESSAGE })
  .trim()
  .min(1, CATEGORY_NAME_REQUIRED_MESSAGE)
  .max(MAX_CATEGORY_NAME_LENGTH, CATEGORY_NAME_TOO_LONG_MESSAGE);

export const createCategoryBodySchema = z.object({
  name: categoryNameSchema,
});

export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;

export const categoryResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

export type CategoryResponse = z.infer<typeof categoryResponseSchema>;

export const categoryListResponseSchema = z.array(categoryResponseSchema);

export type CategoryListResponse = z.infer<typeof categoryListResponseSchema>;
