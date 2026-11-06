import { z } from 'zod';

export enum EquipmentState {
  Available = 'AVAILABLE',
  Retired = 'RETIRED',
}

const EQUIPMENT_NAME_MAX_LENGTH = 100;
const EQUIPMENT_DESCRIPTION_MAX_LENGTH = 1000;
const EQUIPMENT_NAME_LETTER_PATTERN = /\p{L}/u;

export const equipmentStateSchema = z.enum(EquipmentState);

const equipmentNameSchema = z
  .string()
  .max(EQUIPMENT_NAME_MAX_LENGTH)
  .regex(EQUIPMENT_NAME_LETTER_PATTERN);

export const createEquipmentBodySchema = z.object({
  name: equipmentNameSchema,
  categoryId: z.uuid(),
  pickupLocationId: z.uuid(),
  description: z.string().max(EQUIPMENT_DESCRIPTION_MAX_LENGTH).optional(),
});

export type CreateEquipmentBody = z.infer<typeof createEquipmentBodySchema>;

export const createEquipmentResponseSchema = createEquipmentBodySchema.extend({
  id: z.uuid(),
  code: z.string(),
  state: z.literal(EquipmentState.Available),
});

export type CreateEquipmentResponse = z.infer<typeof createEquipmentResponseSchema>;
