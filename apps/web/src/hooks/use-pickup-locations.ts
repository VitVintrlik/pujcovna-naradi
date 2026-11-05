import { useQuery } from '@tanstack/react-query';
import { getPickupLocations } from '../api/client';

export const pickupLocationsQueryKey = ['pickup-locations'] as const;

export const usePickupLocations = () =>
  useQuery({
    queryKey: pickupLocationsQueryKey,
    queryFn: getPickupLocations,
  });
