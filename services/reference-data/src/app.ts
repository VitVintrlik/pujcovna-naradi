import express from 'express';
import { categoryRouter } from './category/category.routes';
import { errorHandler, notFoundHandler } from './errors';
import { healthRouter } from './health/health.routes';
import { pickupLocationRouter } from './pickup-location/pickup-location.routes';

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(healthRouter);
  app.use(categoryRouter);
  app.use(pickupLocationRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
