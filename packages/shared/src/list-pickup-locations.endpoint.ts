import { pickupLocationListResponseSchema } from './pickup-location';
import { defineEndpoint, HttpMethod } from './define-endpoint';

export const listPickupLocationsEndpoint = defineEndpoint({
  method: HttpMethod.Get,
  path: '/pickup-locations',
  response: pickupLocationListResponseSchema,
});
