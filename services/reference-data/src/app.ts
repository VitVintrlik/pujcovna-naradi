import express from 'express';
import type { CategoryAuthorization } from './category/category.routes';
import { createCategoryRouter } from './category/category.routes';
import { errorHandler, notFoundHandler } from './errors';
import { healthRouter } from './health/health.routes';

export const createApp = (categoryAuthorization?: CategoryAuthorization) => {
  const app = express();

  app.use(express.json());
  app.use(healthRouter);
  app.use(createCategoryRouter(categoryAuthorization));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
