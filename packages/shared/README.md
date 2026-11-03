# @pujcovna/shared

Endpoint contracts and the schemas both the web app and the services use.

## New endpoint

Copy this and fill it in from the command in the Application Model:

```ts
import { createCategoryBodySchema, categoryResponseSchema } from './category';
import { defineEndpoint, HttpMethod } from './define-endpoint';

export const createCategoryEndpoint = defineEndpoint({
  method: HttpMethod.Post,
  path: '/categories',
  body: createCategoryBodySchema,
  response: categoryResponseSchema,
});
```

- `params`, `query` and `body` are optional; `response` is required.
- Export the contract from `src/index.ts`.
- Derive types from schemas with `z.infer`; never write them by hand.
