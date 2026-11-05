import { z } from 'zod';
import type { EndpointDefinition } from './define-endpoint';

const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;
const REQUEST_FAILED_MESSAGE = 'Request failed';
const CONTENT_TYPE_HEADER = 'Content-Type';
const JSON_CONTENT_TYPE = 'application/json';
const LOCAL_URL_BASE = 'http://localhost';
const ABSOLUTE_URL_PATTERN = /^https?:\/\//i;

const errorResponseSchema = z.object({
  error: z.object({
    message: z.string(),
  }),
});

type EndpointInput<TEndpoint extends EndpointDefinition> = (TEndpoint extends {
  params: infer Schema extends z.ZodType;
}
  ? { params: z.input<Schema> }
  : object) &
  (TEndpoint extends { query: infer Schema extends z.ZodType }
    ? { query: z.input<Schema> }
    : object) &
  (TEndpoint extends { body: infer Schema extends z.ZodType } ? { body: z.input<Schema> } : object);

type CallEndpointOptions = {
  baseUrl: string;
  timeoutMs?: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getRecordProperty = (record: unknown, key: string) =>
  isRecord(record) ? record[key] : undefined;

const createRequestPath = (path: string, params: unknown) => {
  if (!isRecord(params)) {
    return path;
  }

  return Object.entries(params).reduce(
    (requestPath, [key, value]) =>
      requestPath.replace(`:${key}`, encodeURIComponent(String(value))),
    path,
  );
};

const appendQuery = (url: URL, query: unknown) => {
  if (!isRecord(query)) {
    return;
  }

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const responseText = await response.text();

  if (responseText.length === 0) {
    return undefined;
  }

  try {
    const responseBody: unknown = JSON.parse(responseText);
    return responseBody;
  } catch (error) {
    if (!response.ok) {
      return undefined;
    }

    throw new Error('Response body is not valid JSON', { cause: error });
  }
};

export const callEndpoint = async <
  TEndpoint extends EndpointDefinition,
  TResponse extends z.ZodType,
>(
  endpoint: TEndpoint & { response: TResponse },
  input: EndpointInput<TEndpoint>,
  { baseUrl, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS }: CallEndpointOptions,
): Promise<z.infer<TResponse>> => {
  const requestPath = createRequestPath(endpoint.path, getRecordProperty(input, 'params'));
  const baseUrlWithoutTrailingSlash = baseUrl.replace(/\/$/, '');
  const requestUrl = `${baseUrlWithoutTrailingSlash}${requestPath}`;
  const url = new URL(requestUrl, LOCAL_URL_BASE);
  appendQuery(url, getRecordProperty(input, 'query'));

  const body = getRecordProperty(input, 'body');
  const hasBody = body !== undefined;
  const fetchUrl = ABSOLUTE_URL_PATTERN.test(requestUrl)
    ? url.toString()
    : `${url.pathname}${url.search}`;
  const response = await fetch(fetchUrl, {
    method: endpoint.method,
    headers: hasBody ? { [CONTENT_TYPE_HEADER]: JSON_CONTENT_TYPE } : undefined,
    body: hasBody ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeoutMs),
  });
  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const parsedError = errorResponseSchema.safeParse(responseBody);
    throw new Error(
      parsedError.success
        ? parsedError.data.error.message
        : `${REQUEST_FAILED_MESSAGE}: ${response.status}`,
    );
  }

  return endpoint.response.parse(responseBody);
};
