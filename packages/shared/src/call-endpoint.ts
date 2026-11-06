import type { ZodType } from 'zod';
import type { EndpointDefinition } from './define-endpoint';
import { apiErrorSchema, type ApiError, type ErrorCode } from './errors';

const DEFAULT_TIMEOUT_MS = 10_000;
const CONTENT_TYPE_HEADER = 'Content-Type';
const JSON_CONTENT_TYPE = 'application/json';
const TRAILING_SLASHES_PATTERN = /\/+$/;

type EndpointCallOptions<TBody> = {
  baseUrl: string;
  body?: TBody;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number;
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
  readonly code: ErrorCode;
  readonly details?: unknown;

  constructor(status: number, { code, message, details }: ApiError['error']) {
    super(message);
    this.name = 'EndpointCallError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const createSignal = (signal: AbortSignal | undefined, timeoutMs: number) => {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  return signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;
};

const readResponseBody = async (response: Response): Promise<unknown> =>
  response.headers.get(CONTENT_TYPE_HEADER)?.includes(JSON_CONTENT_TYPE)
    ? response.json()
    : response.text();

const toEndpointCallError = (status: number, responseBody: unknown, request: string) => {
  const apiError = apiErrorSchema.safeParse(responseBody);

  return new EndpointCallError(
    status,
    apiError.success
      ? apiError.data.error
      : {
          code: 'INTERNAL',
          message: `${request} failed with status ${status}`,
          details: responseBody,
        },
  );
};

export const callEndpoint = async <TResponse, TBody = undefined>(
  endpoint: CallableEndpoint<TResponse, TBody>,
  { baseUrl, body, headers, signal, timeoutMs = DEFAULT_TIMEOUT_MS }: EndpointCallOptions<TBody>,
): Promise<TResponse> => {
  const parsedBody = endpoint.body?.parse(body);
  const response = await fetch(`${baseUrl.replace(TRAILING_SLASHES_PATTERN, '')}${endpoint.path}`, {
    method: endpoint.method,
    signal: createSignal(signal, timeoutMs),
    headers:
      parsedBody === undefined ? headers : { ...headers, [CONTENT_TYPE_HEADER]: JSON_CONTENT_TYPE },
    body: parsedBody === undefined ? undefined : JSON.stringify(parsedBody),
  });
  const responseBody = await readResponseBody(response);

  if (!response.ok) {
    throw toEndpointCallError(response.status, responseBody, `${endpoint.method} ${endpoint.path}`);
  }

  return endpoint.response.parse(responseBody);
};
