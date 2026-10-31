import type { HealthResponse } from '@pujcovna/shared';
import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (_request, response) => {
  const body: HealthResponse = { status: 'ok', service: 'auth' };
  response.json(body);
});
