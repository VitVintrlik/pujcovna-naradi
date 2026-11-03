import { categoryListResponseSchema } from './category';
import { defineEndpoint, HttpMethod } from './define-endpoint';

export const listCategoriesEndpoint = defineEndpoint({
  method: HttpMethod.Get,
  path: '/categories',
  response: categoryListResponseSchema,
});
