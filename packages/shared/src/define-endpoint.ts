import type { ZodType } from 'zod';

export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Patch = 'PATCH',
}

export type EndpointDefinition = {
  method: HttpMethod;
  path: `/${string}`;
  params?: ZodType;
  query?: ZodType;
  body?: ZodType;
  response: ZodType;
};

export const defineEndpoint = <const TEndpoint extends EndpointDefinition>(
  endpoint: TEndpoint,
): TEndpoint => endpoint;
