import { authenticatedUserSchema, type AuthenticatedUser } from '@pujcovna/shared';
import { createRemoteJWKSet, jwtVerify, type JWTPayload, type JWTVerifyGetKey } from 'jose';
import { AppError } from './app-error';
import {
  INVALID_TOKEN_ERRORS,
  JWKS_REQUEST_TIMEOUT_MS,
  JwtAlgorithm,
  REQUIRED_CLAIMS,
  UNAUTHORIZED_MESSAGE,
} from './auth.constants';

export type JwtVerifierConfig = { issuer: string; audience: string };

export const createRemoteKeySet = (jwksUrl: string): JWTVerifyGetKey =>
  createRemoteJWKSet(new URL(jwksUrl), { timeoutDuration: JWKS_REQUEST_TIMEOUT_MS });

export class JwtVerifier {
  constructor(
    private readonly keySet: JWTVerifyGetKey,
    private readonly config: JwtVerifierConfig,
  ) {}

  verify = async (token: string): Promise<AuthenticatedUser> => {
    const payload = await this.verifySignature(token);
    return this.toAuthenticatedUser(payload);
  };

  private verifySignature = async (token: string): Promise<JWTPayload> => {
    try {
      const { payload } = await jwtVerify(token, this.keySet, {
        issuer: this.config.issuer,
        audience: this.config.audience,
        algorithms: [JwtAlgorithm.EdDSA],
        requiredClaims: REQUIRED_CLAIMS,
      });
      return payload;
    } catch (error) {
      if (INVALID_TOKEN_ERRORS.some((errorClass) => error instanceof errorClass)) {
        throw new AppError('UNAUTHORIZED', UNAUTHORIZED_MESSAGE);
      }
      throw error;
    }
  };

  private toAuthenticatedUser = ({ sub, name, email, role }: JWTPayload): AuthenticatedUser => {
    const parsed = authenticatedUserSchema.safeParse({ id: sub, name, email, role });
    if (!parsed.success) {
      console.error(
        'Verified token has invalid claims',
        parsed.error.issues.map(({ path, message }) => ({ path, message })),
      );
      throw new AppError('UNAUTHORIZED', UNAUTHORIZED_MESSAGE);
    }
    return parsed.data;
  };
}
