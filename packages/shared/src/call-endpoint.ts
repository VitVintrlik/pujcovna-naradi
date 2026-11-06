import { z } from 'zod';
import type { ZodType } from 'zod';
import type { EndpointDefinition } from './define-endpoint';

const apiErrorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string(), details: z.unknown().optional() }),
});
const JSON_CONTENT_TYPE = 'application/json';

type EndpointCallOptions<TBody> = {
  baseUrl: string;
  timeoutMs: number;
  body?: TBody;
};

// URL parameters and query schemas are excluded until a consumer needs them.
type CallableEndpoint<TResponse, TBody> = Pick<EndpointDefinition, 'method' | 'path'> & {
  response: ZodType<TResponse>;
  body?: ZodType<TBody>;
  params?: never;
  query?: never;
};

export class EndpointCallError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(status: number, { code, message, details }: z.infer<typeof apiErrorSchema>['error']) {
    super(message);
    this.name = 'EndpointCallError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const callEndpoint = async <TResponse, TBody = undefined>(
  endpoint: CallableEndpoint<TResponse, TBody>,
  { baseUrl, timeoutMs, body }: EndpointCallOptions<TBody>,
): Promise<TResponse> => {
  const parsedBody = endpoint.body?.parse(body);
  const response = await fetch(`${baseUrl.replace(/\/+$/, '')}${endpoint.path}`, {
    method: endpoint.method,
    signal: AbortSignal.timeout(timeoutMs),
    headers: parsedBody === undefined ? undefined : { 'Content-Type': JSON_CONTENT_TYPE },
    body: parsedBody === undefined ? undefined : JSON.stringify(parsedBody),
  });
  const data: unknown = await response.json();

  if (!response.ok) {
    throw new EndpointCallError(response.status, apiErrorSchema.parse(data).error);
  }

  return endpoint.response.parse(data);
};
