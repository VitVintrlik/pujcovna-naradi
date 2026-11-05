import type { PickupLocationListResponse, PickupLocationResponse } from '@pujcovna/shared';
import { createPickupLocationEndpoint, listPickupLocationsEndpoint } from '@pujcovna/shared';
import { Router } from 'express';
import { createPickupLocation, listPickupLocations } from './pickup-location.service';

const CREATED_STATUS = 201;

export const pickupLocationRouter = Router();

pickupLocationRouter.get(listPickupLocationsEndpoint.path, async (_request, response) => {
  const body: PickupLocationListResponse = await listPickupLocations();
  response.json(body);
});

pickupLocationRouter.post(createPickupLocationEndpoint.path, async (request, response) => {
  const input = createPickupLocationEndpoint.body.parse(request.body);
  const body: PickupLocationResponse = await createPickupLocation(input);
  response.status(CREATED_STATUS).json(body);
});
