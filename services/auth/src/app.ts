import { errorHandler, notFoundHandler } from '@pujcovna/server';
import express from 'express';
import { PrismaClient } from '../generated/prisma/client';
import { AuditLogRepository } from './audit-log/audit-log.repository';
import { AuditLogService } from './audit-log/audit-log.service';
import { AuthController } from './auth/auth.controller';
import { BetterAuthFactory } from './auth/better-auth.factory';
import { environment } from './env';
import { healthRouter } from './health/health.routes';
import { UserRepository } from './user/user.repository';

export const createApp = () => {
  const prisma = new PrismaClient({ datasourceUrl: environment.DATABASE_URL });
  const auditLogRepository = new AuditLogRepository(prisma);
  const userRepository = new UserRepository(prisma);
  const auditLogService = new AuditLogService(auditLogRepository, userRepository);
  const betterAuth = new BetterAuthFactory(prisma, auditLogService, {
    baseUrl: environment.BETTER_AUTH_URL,
    secret: environment.BETTER_AUTH_SECRET,
    webOrigin: environment.WEB_ORIGIN,
    googleClientId: environment.GOOGLE_CLIENT_ID,
    googleClientSecret: environment.GOOGLE_CLIENT_SECRET,
  }).create();
  const authController = new AuthController(betterAuth);

  const app = express();
  // Better Auth reads the raw body, so it is mounted before express.json()
  app.use(authController.router);
  app.use(express.json());
  app.use(healthRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};
