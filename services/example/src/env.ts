import { existsSync } from 'node:fs';
import { z } from 'zod';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const environmentSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
});

const parsed = environmentSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables (see .env.example):');
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const environment = parsed.data;
