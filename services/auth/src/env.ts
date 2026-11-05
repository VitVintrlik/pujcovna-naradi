import { existsSync } from 'node:fs';
import { z } from 'zod';
import { BETTER_AUTH_SECRET_MIN_LENGTH } from './auth/auth.constants';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const environmentSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3100),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_URL: z.url().default('http://localhost:3100'),
  BETTER_AUTH_SECRET: z.string().min(BETTER_AUTH_SECRET_MIN_LENGTH),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  WEB_ORIGIN: z.url().default('http://localhost:5173'),
});

const parsed = environmentSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables (see .env.example):');
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const environment = parsed.data;
