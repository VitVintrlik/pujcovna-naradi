
import { createCategoryBodySchema, categoryResponseSchema } from './category';
import { defineEndpoint } from './define-endpoint';

// Authorization is enforced by the backend, not by the contract.
export const createCategoryEndpoint = defineEndpoint({
  method: 'POST',
  path: '/categories',
  body: createCategoryBodySchema,
  response: categoryResponseSchema,
});
