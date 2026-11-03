import { PrismaClient } from '../generated/prisma/client';
import { environment } from './env';

export const prisma = new PrismaClient({
  datasourceUrl: environment.DATABASE_URL,
});
