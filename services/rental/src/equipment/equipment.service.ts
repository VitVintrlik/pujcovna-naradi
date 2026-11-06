import type { CreateEquipmentBody, CreateEquipmentResponse } from '@pujcovna/shared';
import { equipmentState } from '../../generated/prisma/client';
import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../prisma';
import { toCreateEquipmentResponse } from './equipment.mapper';
import { assertCategoryExists, assertPickupLocationExists } from './equipment.references';

const EQUIPMENT_COUNTER_ID = 'equipment';
const EQUIPMENT_CODE_PREFIX = 'K';
const EQUIPMENT_CODE_MIN_DIGITS = 3;
const EQUIPMENT_CODE_PADDING = '0';
const EQUIPMENT_CODE_INCREMENT = 1;

const allocateEquipmentCode = async ({
  transaction,
}: {
  transaction: Prisma.TransactionClient;
}) => {
  // Updating the shared counter locks its row until creation commits or rolls back.
  const { lastNumber } = await transaction.equipmentCodeCounter.update({
    where: { id: EQUIPMENT_COUNTER_ID },
    data: { lastNumber: { increment: EQUIPMENT_CODE_INCREMENT } },
    select: { lastNumber: true },
  });
  return `${EQUIPMENT_CODE_PREFIX}${String(lastNumber).padStart(EQUIPMENT_CODE_MIN_DIGITS, EQUIPMENT_CODE_PADDING)}`;
};

type CreateEquipmentOptions = {
  body: CreateEquipmentBody;
};

export const createEquipment = async ({
  body,
}: CreateEquipmentOptions): Promise<CreateEquipmentResponse> => {
  await assertCategoryExists({ categoryId: body.categoryId });
  await assertPickupLocationExists({ pickupLocationId: body.pickupLocationId });

  return await prisma.$transaction(async (transaction) => {
    const code = await allocateEquipmentCode({ transaction });
    const equipment = await transaction.equipment.create({
      data: {
        code,
        name: body.name,
        categoryId: body.categoryId,
        pickupLocationId: body.pickupLocationId,
        description: body.description ?? null,
        state: equipmentState.AVAILABLE,
      },
    });
    return toCreateEquipmentResponse(equipment);
  });
};
