import { callEndpoint, listCategoriesEndpoint } from '@pujcovna/shared';
import type { CreateEquipmentBody } from '@pujcovna/shared';
import { environment } from '../env';
import { AppError } from '../errors';
import { EQUIPMENT_INVALID_INPUT_MESSAGE } from './equipment.constants';

export type PickupLocationExistenceCheck = (
  input: Pick<CreateEquipmentBody, 'pickupLocationId'>,
) => Promise<void>;

export const assertCategoryExists = async ({
  categoryId,
}: Pick<CreateEquipmentBody, 'categoryId'>) => {
  const categories = await callEndpoint(listCategoriesEndpoint, {
    baseUrl: environment.REFERENCE_DATA_URL,
    timeoutMs: environment.REFERENCE_DATA_TIMEOUT_MS,
  });

  if (!categories.some(({ id }) => id === categoryId)) {
    throw new AppError('VALIDATION_FAILED', EQUIPMENT_INVALID_INPUT_MESSAGE);
  }
};
