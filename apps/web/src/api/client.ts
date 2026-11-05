import {
  callEndpoint,
  createPickupLocationEndpoint,
  listPickupLocationsEndpoint,
  type CreatePickupLocationBody,
} from '@pujcovna/shared';

const REFERENCE_DATA_API_BASE_URL = '/api/reference-data';

export const getPickupLocations = () =>
  callEndpoint(listPickupLocationsEndpoint, {}, { baseUrl: REFERENCE_DATA_API_BASE_URL });

export const createPickupLocation = (body: CreatePickupLocationBody) =>
  callEndpoint(createPickupLocationEndpoint, { body }, { baseUrl: REFERENCE_DATA_API_BASE_URL });
