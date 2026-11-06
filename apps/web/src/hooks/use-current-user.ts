import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../api/client';

export const currentUserQueryKey = ['current-user'] as const;

export const useCurrentUser = () =>
  useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
  });
