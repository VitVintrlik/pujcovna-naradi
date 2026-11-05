import type { ApiError, ErrorCode } from '@pujcovna/shared';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

const statusByCode: Record<ErrorCode, number> = {
  VALIDATION_FAILED: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL: 500,
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly details?: unknown;

  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export const notFoundHandler: RequestHandler = (request) => {
  throw new AppError('NOT_FOUND', `Route ${request.method} ${request.path} does not exist`);
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const appError =
    error instanceof AppError
      ? error
      : error instanceof ZodError
        ? new AppError('VALIDATION_FAILED', 'Invalid input', error.issues)
        : undefined;

  if (!appError) {
    console.error(error);
  }

  const code = appError?.code ?? 'INTERNAL';
  const body: ApiError = {
    error: {
      code,
      message: appError?.message ?? 'Unexpected server error',
      details: appError?.details,
    },
  };
  response.status(statusByCode[code]).json(body);
};
