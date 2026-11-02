import { PrismaClient } from '../generated/prisma/client';
import { environment } from './env';

// Share one database client across service operations.
export const prisma = new PrismaClient({
  datasourceUrl: environment.DATABASE_URL,
});
