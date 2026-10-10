export type ErrorCode =
  'VALIDATION_FAILED' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL';

export type ApiError = {
  error: {
    code: ErrorCode;
    message: string;
    details?: unknown;
  };
};
