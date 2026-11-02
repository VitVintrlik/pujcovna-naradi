import { categoryListResponseSchema } from './category';
import { defineEndpoint } from './define-endpoint';

// Category listing is public and does not require sign-in.
export const listCategoriesEndpoint = defineEndpoint({
  method: 'GET',
  path: '/categories',
  response: categoryListResponseSchema,
});
