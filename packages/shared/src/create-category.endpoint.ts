import { createCategoryBodySchema, categoryResponseSchema } from './category';
import { defineEndpoint, HttpMethod } from './define-endpoint';

export const createCategoryEndpoint = defineEndpoint({
  method: HttpMethod.Post,
  path: '/categories',
  body: createCategoryBodySchema,
  response: categoryResponseSchema,
});
