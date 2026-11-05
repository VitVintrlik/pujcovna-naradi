import type { PickupLocationResponse } from '@pujcovna/shared';
import { openingHoursResponseSchema } from '@pujcovna/shared';
import type { pickupLocation } from '../../generated/prisma/client';
import { AppError } from '../errors';

export const toPickupLocationResponse = ({
  id,
  name,
  street,
  houseNumber,
  postalCode,
  city,
  openingHours,
}: pickupLocation): PickupLocationResponse => {
  const parsedOpeningHours = openingHoursResponseSchema.safeParse(openingHours);
  if (!parsedOpeningHours.success) {
    throw new AppError('INTERNAL', 'Unexpected server error');
  }

  return {
    id,
    name,
    street,
    houseNumber,
    postalCode,
    city,
    openingHours: parsedOpeningHours.data,
  };
};
