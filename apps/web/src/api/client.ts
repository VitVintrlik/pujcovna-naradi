import {
  authenticatedUserSchema,
  callEndpoint,
  createCategoryEndpoint,
  listCategoriesEndpoint,
  type CreateCategoryBody,
  createPickupLocationEndpoint,
  listPickupLocationsEndpoint,
  type CreatePickupLocationBody,
} from '@pujcovna/shared';
import { createAuthClient } from 'better-auth/client';
import { jwtClient } from 'better-auth/client/plugins';

const AUTH_API_BASE_PATH = '/api/auth';
const REFERENCE_DATA_API_BASE_URL = '/api/reference-data';
const GOOGLE_PROVIDER = 'google';

const authClient = createAuthClient({
  baseURL: `${window.location.origin}${AUTH_API_BASE_PATH}`,
  plugins: [jwtClient()],
  fetchOptions: { throw: true },
});

const getAuthorizationHeaders = async () => {
  const { token } = await authClient.token();
  return { Authorization: `Bearer ${token}` };
};

export const getCurrentUser = async () => {
  const session = await authClient.getSession();
  return session ? authenticatedUserSchema.parse(session.user) : null;
};

export const signIn = async () => {
  await authClient.signIn.social({ provider: GOOGLE_PROVIDER, callbackURL: window.location.href });
};

export const signOut = async () => {
  await authClient.signOut();
};

export const getCategories = (signal: AbortSignal) =>
  callEndpoint(listCategoriesEndpoint, { baseUrl: REFERENCE_DATA_API_BASE_URL, signal });

export const createCategory = async (body: CreateCategoryBody) =>
  callEndpoint(createCategoryEndpoint, {
    baseUrl: REFERENCE_DATA_API_BASE_URL,
    body,
    headers: await getAuthorizationHeaders(),
  });

export const getPickupLocations = (signal: AbortSignal) =>
  callEndpoint(listPickupLocationsEndpoint, { baseUrl: REFERENCE_DATA_API_BASE_URL, signal });

export const createPickupLocation = async (body: CreatePickupLocationBody) =>
  callEndpoint(createPickupLocationEndpoint, {
    baseUrl: REFERENCE_DATA_API_BASE_URL,
    body,
    headers: await getAuthorizationHeaders(),
  });
