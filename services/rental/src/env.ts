import { existsSync } from 'node:fs';
import { z } from 'zod';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const DEFAULT_REFERENCE_DATA_URL = 'http://localhost:3002';
const DEFAULT_REFERENCE_DATA_TIMEOUT_MS = 5000;

const environmentSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3003),
  DATABASE_URL: z.string().min(1),
  REFERENCE_DATA_URL: z.url().default(DEFAULT_REFERENCE_DATA_URL),
  REFERENCE_DATA_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(DEFAULT_REFERENCE_DATA_TIMEOUT_MS),
});

const parsed = environmentSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables (see .env.example):');
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const environment = parsed.data;
