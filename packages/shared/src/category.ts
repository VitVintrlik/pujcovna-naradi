import { z } from 'zod';

const CATEGORY_NAME_REQUIRED_MESSAGE = 'Název kategorie je povinný.';
const MAX_CATEGORY_NAME_LENGTH = 100;

export const categoryNameSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined || issue.input === null
        ? CATEGORY_NAME_REQUIRED_MESSAGE
        : undefined,
  })
  .trim()
  .min(1, CATEGORY_NAME_REQUIRED_MESSAGE)
  .max(MAX_CATEGORY_NAME_LENGTH);

export const createCategoryBodySchema = z.object({
  name: categoryNameSchema,
});

export const categoryResponseSchema = z.object({
  id: z.uuid(),
  name: categoryNameSchema,
});

export type CategoryResponse = z.infer<typeof categoryResponseSchema>;

export const categoryListResponseSchema = z.array(categoryResponseSchema);

export type CategoryListResponse = z.infer<typeof categoryListResponseSchema>;
