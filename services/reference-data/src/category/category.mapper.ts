import type { CategoryResponse } from '@pujcovna/shared';
import type { category } from '../../generated/prisma/client';

export const toCategoryResponse = ({ id, name }: category): CategoryResponse => ({
  id,
  name,
});
