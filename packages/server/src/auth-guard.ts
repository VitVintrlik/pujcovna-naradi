import type { AuthenticatedUser, UserRole } from '@pujcovna/shared';
import type { Request, RequestHandler } from 'express';
import { AppError } from './app-error';
import { BEARER_SCHEME, FORBIDDEN_MESSAGE, UNAUTHORIZED_MESSAGE } from './auth.constants';
import type { JwtVerifier } from './jwt-verifier';

export class AuthGuard {
  private readonly authenticatedUsers = new WeakMap<Request, AuthenticatedUser>();

  constructor(private readonly jwtVerifier: JwtVerifier) {}

  // Marks a route as public on purpose, so every route states its access rule.
  static allowPublic = (): RequestHandler => (_request, _response, next) => next();

  requireAuth = (): RequestHandler => async (request, _response, next) => {
    const token = this.readBearerToken(request.headers.authorization);
    this.authenticatedUsers.set(request, await this.jwtVerifier.verify(token));
    next();
  };

  requireRole =
    (...roles: UserRole[]): RequestHandler =>
    (request, _response, next) => {
      const { role } = this.getUser(request);
      if (!roles.includes(role)) {
        throw new AppError('FORBIDDEN', FORBIDDEN_MESSAGE);
      }
      next();
    };

  getUser = (request: Request): AuthenticatedUser => {
    const user = this.authenticatedUsers.get(request);
    if (!user) {
      throw new AppError('UNAUTHORIZED', UNAUTHORIZED_MESSAGE);
    }
    return user;
  };

  private readBearerToken = (header: string | undefined): string => {
    const [scheme, token] = (header ?? '').split(' ');
    if (scheme?.toLowerCase() !== BEARER_SCHEME || !token) {
      throw new AppError('UNAUTHORIZED', UNAUTHORIZED_MESSAGE);
    }
    return token;
  };
}
