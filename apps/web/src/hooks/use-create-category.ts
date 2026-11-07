import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '../api/client';
import { categoriesQueryKey } from './use-categories';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
    },
  });
};
