import express from 'express';
import { equipmentRouter } from './equipment/equipment.routes';
import { errorHandler, notFoundHandler } from './errors';
import { healthRouter } from './health/health.routes';

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(healthRouter);
  app.use(equipmentRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
};
