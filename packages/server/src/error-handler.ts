import type { ApiError, ErrorCode } from '@pujcovna/shared';
import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from './app-error';

const statusByCode: Record<ErrorCode, number> = {
  VALIDATION_FAILED: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL: 500,
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
