import { AuthGuard } from '@pujcovna/server';
import { toNodeHandler } from 'better-auth/node';
import { Router } from 'express';
import { AUTH_ROUTE } from './auth.constants';
import type { BetterAuth } from './better-auth.factory';

export class AuthController {
  readonly router = Router();

  constructor(betterAuth: BetterAuth) {
    this.router.all(AUTH_ROUTE, AuthGuard.allowPublic(), toNodeHandler(betterAuth));
  }
}
