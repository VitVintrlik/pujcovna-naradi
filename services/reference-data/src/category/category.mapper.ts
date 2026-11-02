import type { CategoryResponse } from '@pujcovna/shared';

// Prevent database-only fields from leaking into API responses.
export const toCategoryResponse = ({ id, name }: CategoryResponse): CategoryResponse => ({
  id,
  name,
});
