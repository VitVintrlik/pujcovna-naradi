import type { CategoryListResponse, CategoryResponse } from '@pujcovna/shared';
import { createCategoryEndpoint, listCategoriesEndpoint } from '@pujcovna/shared';
import type { Request, RequestHandler } from 'express';
import { Router } from 'express';
import { AppError } from '../errors';
import { createCategory, listCategories } from './category.service';

const CREATED_STATUS = 201;

// Supply requireWorker from the team's requireRole(worker), not from client input.
export type CategoryAuthorization = {
  requireAuth: RequestHandler;
  requireWorker: RequestHandler;
  getActorId: (request: Request) => string | undefined;
};

export const createCategoryRouter = (authorization?: CategoryAuthorization) => {
  const categoryRouter = Router();

  // Public route: category listing does not require authentication.
  categoryRouter.get(listCategoriesEndpoint.path, async (_request, response) => {
    const body: CategoryListResponse = await listCategories();
    response.json(body);
  });

  if (!authorization) {
    // Fail closed until the shared authentication and role middleware is available.
    categoryRouter.post(createCategoryEndpoint.path, () => {
      throw new AppError('UNAUTHORIZED', 'Sign-in is required.');
    });
    return categoryRouter;
  }

  categoryRouter.post(
    createCategoryEndpoint.path,
    authorization.requireAuth,
    authorization.requireWorker,
    async (request, response) => {
      const actorId = authorization.getActorId(request);
      if (!actorId) {
        throw new AppError('UNAUTHORIZED', 'Sign-in is required.');
      }

      const { name } = createCategoryEndpoint.body.parse(request.body);
      const body: CategoryResponse = await createCategory(name, actorId);
      response.status(CREATED_STATUS).json(body);
    },
  );

  return categoryRouter;
};
