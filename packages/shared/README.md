# Shared endpoint contracts

`defineEndpoint()` preserves the method, path, and exact Zod schema types of an
endpoint. It describes a contract; parsing requests and enforcing authentication
remain the responsibility of the backend route.

## Endpoint template

Use the category creation contract as the template for the next endpoint:

```ts
import { createCategoryBodySchema, categoryResponseSchema } from './category';
import { defineEndpoint } from './define-endpoint';

export const createCategoryEndpoint = defineEndpoint({
  method: 'POST',
  path: '/categories',
  body: createCategoryBodySchema,
  response: categoryResponseSchema,
});
```

Replace the entity, method, path, and schemas with the endpoint's approved
Application Model command. Add `params` or `query` schemas when the command uses
them; omit `body` for a request without a body. Export the contract and its schemas
from `src/index.ts` so both the frontend and backend use `@pujcovna/shared`.
Derive DTO types with `z.infer<typeof schema>`.

On the backend, register the contract's `path`, parse input using its schemas,
call the service, and send the response type derived from `response`. Protected
routes must use the team's authentication and role middleware before handling
the request. A contract does not make a protected route public.

The existing GET template is [`list-categories.endpoint.ts`](src/list-categories.endpoint.ts);
the POST implementation is [`create-category.endpoint.ts`](src/create-category.endpoint.ts).
