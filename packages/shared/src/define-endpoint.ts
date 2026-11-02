
import type { ZodType } from 'zod';

type EndpointDefinition = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  params?: ZodType;
  query?: ZodType;
  body?: ZodType;
  response: ZodType;
};

// Preserve the exact types of an endpoint's schemas.
export const defineEndpoint = <const TEndpoint extends EndpointDefinition>(
  endpoint: TEndpoint,
): TEndpoint => endpoint;
