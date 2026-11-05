import { JwtAlgorithm, JwtCurve } from '@pujcovna/server';
import { UserRole, userRoleSchema } from '@pujcovna/shared';
import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { jwt } from 'better-auth/plugins/jwt';
import type { PrismaClient } from '../../generated/prisma/client';
import type { AuditLogService } from '../audit-log/audit-log.service';
import {
  AUTH_BASE_PATH,
  DATABASE_PROVIDER,
  GOOGLE_ACCOUNT_PROMPT,
  JWT_EXPIRATION_TIME,
} from './auth.constants';

export type BetterAuthConfig = {
  baseUrl: string;
  secret: string;
  webOrigin: string;
  googleClientId: string;
  googleClientSecret: string;
};

export class BetterAuthFactory {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly auditLogService: AuditLogService,
    private readonly config: BetterAuthConfig,
  ) {}

  create = () =>
    betterAuth({
      baseURL: this.config.baseUrl,
      basePath: AUTH_BASE_PATH,
      secret: this.config.secret,
      trustedOrigins: [this.config.webOrigin],
      onAPIError: { errorURL: this.config.webOrigin },
      database: prismaAdapter(this.prisma, { provider: DATABASE_PROVIDER }),
      socialProviders: {
        google: {
          clientId: this.config.googleClientId,
          clientSecret: this.config.googleClientSecret,
          prompt: GOOGLE_ACCOUNT_PROMPT,
        },
      },
      user: {
        additionalFields: {
          role: { type: 'string', required: false, defaultValue: UserRole.Customer, input: false },
        },
      },
      databaseHooks: this.createAuditHooks(),
      plugins: [this.createJwtPlugin()],
    });

  private createAuditHooks = (): BetterAuthOptions['databaseHooks'] => ({
    user: {
      create: {
        after: async (user) => {
          await this.auditLogService.recordRegistration({
            userId: user.id,
            role: userRoleSchema.parse(user.role),
          });
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          await this.auditLogService.recordSignIn({ sessionId: session.id, userId: session.userId });
        },
      },
    },
  });

  private createJwtPlugin = () =>
    jwt({
      jwks: { keyPairConfig: { alg: JwtAlgorithm.EdDSA, crv: JwtCurve.Ed25519 } },
      jwt: {
        issuer: this.config.baseUrl,
        audience: this.config.baseUrl,
        expirationTime: JWT_EXPIRATION_TIME,
        definePayload: ({ user }) => ({
          name: user.name,
          email: user.email,
          role: userRoleSchema.parse(user.role),
        }),
      },
    });
}

export type BetterAuth = ReturnType<BetterAuthFactory['create']>;
