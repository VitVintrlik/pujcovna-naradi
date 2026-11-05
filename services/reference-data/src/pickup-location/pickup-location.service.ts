import type { CreatePickupLocationBody } from '@pujcovna/shared';
import { Prisma } from '../../generated/prisma/client';
import { AppError } from '@pujcovna/server';
import { prisma } from '../prisma';
import { toPickupLocationResponse } from './pickup-location.mapper';

const DUPLICATE_ADDRESS_MESSAGE = 'Výdejní místo s touto adresou již existuje.';
const UNIQUE_CONSTRAINT_ERROR = 'P2002';
const ADDRESS_COLUMNS = ['street', 'house_number', 'postal_code', 'city'] as const;

const isDuplicateAddressError = (error: unknown) => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return false;
  }

  const target = error.meta?.target;
  return (
    error.code === UNIQUE_CONSTRAINT_ERROR &&
    Array.isArray(target) &&
    target.length === ADDRESS_COLUMNS.length &&
    ADDRESS_COLUMNS.every((column) => target.includes(column))
  );
};

export const listPickupLocations = async () => {
  const pickupLocations = await prisma.pickupLocation.findMany({
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
  });
  return pickupLocations.map(toPickupLocationResponse);
};

export const createPickupLocation = async ({
  name,
  street,
  houseNumber,
  postalCode,
  city,
  openingHours,
}: CreatePickupLocationBody) => {
  try {
    const pickupLocation = await prisma.pickupLocation.create({
      data: { name, street, houseNumber, postalCode, city, openingHours },
    });
    return toPickupLocationResponse(pickupLocation);
  } catch (error) {
    if (isDuplicateAddressError(error)) {
      throw new AppError('VALIDATION_FAILED', DUPLICATE_ADDRESS_MESSAGE);
    }

    throw error;
  }
};
