import type { z } from 'zod';

const REQUEST_TIMEOUT_MS = 10_000;

export const apiGet = async <Schema extends z.ZodType>(
  path: string,
  schema: Schema,
): Promise<z.infer<Schema>> => {
  const response = await fetch(path, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!response.ok) {
    throw new Error(`GET ${path} failed with status ${response.status}`);
  }
  return schema.parse(await response.json());
};
