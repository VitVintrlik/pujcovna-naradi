import { defineEndpoint, HttpMethod } from './define-endpoint';
import { createEquipmentBodySchema, createEquipmentResponseSchema } from './equipment';

export const createEquipmentEndpoint = defineEndpoint({
  method: HttpMethod.Post,
  path: '/create-equipment',
  body: createEquipmentBodySchema,
  response: createEquipmentResponseSchema,
});
