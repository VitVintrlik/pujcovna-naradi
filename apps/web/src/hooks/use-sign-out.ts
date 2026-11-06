import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut } from '../api/client';
import { currentUserQueryKey } from './use-current-user';

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: currentUserQueryKey });
    },
  });
};
