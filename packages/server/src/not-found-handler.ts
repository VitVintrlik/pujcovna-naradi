import type { RequestHandler } from 'express';
import { AppError } from './app-error';

export const notFoundHandler: RequestHandler = (request) => {
  throw new AppError('NOT_FOUND', `Route ${request.method} ${request.path} does not exist`);
};
