import { createEquipmentResponseSchema } from '@pujcovna/shared';
import type { CreateEquipmentResponse } from '@pujcovna/shared';
import type { equipment } from '../../generated/prisma/client';

export const toCreateEquipmentResponse = ({
  id,
  code,
  name,
  categoryId,
  pickupLocationId,
  description,
  state,
}: equipment): CreateEquipmentResponse => ({
  id,
  code,
  name,
  categoryId,
  pickupLocationId,
  state: createEquipmentResponseSchema.shape.state.parse(state),
  ...(description === null ? {} : { description }),
});
