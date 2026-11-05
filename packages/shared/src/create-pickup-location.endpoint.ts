import { createPickupLocationBodySchema, pickupLocationResponseSchema } from './pickup-location';
import { defineEndpoint, HttpMethod } from './define-endpoint';

export const createPickupLocationEndpoint = defineEndpoint({
  method: HttpMethod.Post,
  path: '/pickup-locations',
  body: createPickupLocationBodySchema,
  response: pickupLocationResponseSchema,
});
