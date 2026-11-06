import { EndpointCallError } from '@pujcovna/shared';

const FIRST_SERVER_ERROR_STATUS = 500;
const UNEXPECTED_ERROR_MESSAGE = 'Něco se pokazilo. Zkuste to prosím znovu.';

export const isClientError = (error: Error) =>
  error instanceof EndpointCallError && error.status < FIRST_SERVER_ERROR_STATUS;

export const getErrorMessage = (error: Error) =>
  isClientError(error) ? error.message : UNEXPECTED_ERROR_MESSAGE;
