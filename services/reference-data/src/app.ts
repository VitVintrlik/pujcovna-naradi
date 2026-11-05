import express from 'express';
import {
  AuthGuard,
  JwtVerifier,
  createRemoteKeySet,
  errorHandler,
  notFoundHandler,
} from '@pujcovna/server';
import { createCategoryRouter } from './category/category.routes';
import { environment } from './env';
import { healthRouter } from './health/health.routes';
import { createPickupLocationRouter } from './pickup-location/pickup-location.routes';

export const createApp = () => {
  const app = express();
  const jwtVerifier = new JwtVerifier(createRemoteKeySet(environment.AUTH_JWKS_URL), {
    issuer: environment.AUTH_ISSUER,
    audience: environment.AUTH_AUDIENCE,
  });
  const authGuard = new AuthGuard(jwtVerifier);

  app.use(express.json());
  app.use(healthRouter);
  app.use(createCategoryRouter(authGuard));
  app.use(createPickupLocationRouter(authGuard));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
