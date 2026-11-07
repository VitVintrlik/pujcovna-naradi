import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/client';

export const categoriesQueryKey = ['categories'] as const;

export const useCategories = () =>
  useQuery({
    queryKey: categoriesQueryKey,
    queryFn: ({ signal }) => getCategories(signal),
  });
