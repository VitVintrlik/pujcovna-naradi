import { createEquipmentEndpoint } from '@pujcovna/shared';
import type { CreateEquipmentResponse } from '@pujcovna/shared';
import { Router } from 'express';
import { AppError } from '@pujcovna/server';
import { EQUIPMENT_INVALID_INPUT_MESSAGE } from './equipment.constants';
import { createEquipment } from './equipment.service';

const CREATED_STATUS = 201;

export const equipmentRouter = Router();

equipmentRouter.post(createEquipmentEndpoint.path, async (request, response) => {
  const parsedBody = createEquipmentEndpoint.body.safeParse(request.body);

  if (!parsedBody.success) {
    throw new AppError(
      'VALIDATION_FAILED',
      EQUIPMENT_INVALID_INPUT_MESSAGE,
      parsedBody.error.issues,
    );
  }

  const body: CreateEquipmentResponse = await createEquipment({ body: parsedBody.data });
  response.status(CREATED_STATUS).json(body);
});
