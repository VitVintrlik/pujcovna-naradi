import {
  callEndpoint,
  createPickupLocationEndpoint,
  listPickupLocationsEndpoint,
  type CreatePickupLocationBody,
} from '@pujcovna/shared';

const REFERENCE_DATA_API_BASE_URL = '/api/reference-data';
const REQUEST_TIMEOUT_MS = 10_000;

export const getPickupLocations = () =>
  callEndpoint(listPickupLocationsEndpoint, {
    baseUrl: REFERENCE_DATA_API_BASE_URL,
    timeoutMs: REQUEST_TIMEOUT_MS,
  });

export const createPickupLocation = (body: CreatePickupLocationBody) =>
  callEndpoint(createPickupLocationEndpoint, {
    baseUrl: REFERENCE_DATA_API_BASE_URL,
    timeoutMs: REQUEST_TIMEOUT_MS,
    body,
  });
