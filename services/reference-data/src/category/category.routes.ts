import type { CategoryListResponse, CategoryResponse } from '@pujcovna/shared';
import { UserRole, createCategoryEndpoint, listCategoriesEndpoint } from '@pujcovna/shared';
import { AuthGuard } from '@pujcovna/server';
import { Router } from 'express';
import { createCategory, listCategories } from './category.service';

const CREATED_STATUS = 201;

export const createCategoryRouter = ({ requireAuth, requireRole }: AuthGuard) => {
  const categoryRouter = Router();

  categoryRouter.get(listCategoriesEndpoint.path, AuthGuard.allowPublic(), async (_request, response) => {
    const body: CategoryListResponse = await listCategories();
    response.json(body);
  });

  categoryRouter.post(
    createCategoryEndpoint.path,
    requireAuth(),
    requireRole(UserRole.Worker),
    async (request, response) => {
      const { name } = createCategoryEndpoint.body.parse(request.body);
      const body: CategoryResponse = await createCategory(name);
      response.status(CREATED_STATUS).json(body);
    },
  );

  return categoryRouter;
};
