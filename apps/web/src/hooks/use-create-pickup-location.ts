import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPickupLocation } from '../api/client';
import { pickupLocationsQueryKey } from './use-pickup-locations';

export const useCreatePickupLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPickupLocation,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: pickupLocationsQueryKey });
    },
  });
};
