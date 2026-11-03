import type { CategoryListResponse, CategoryResponse } from '@pujcovna/shared';
import { createCategoryEndpoint, listCategoriesEndpoint } from '@pujcovna/shared';
import { Router } from 'express';
import { createCategory, listCategories } from './category.service';

const CREATED_STATUS = 201;

export const categoryRouter = Router();

categoryRouter.get(listCategoriesEndpoint.path, async (_request, response) => {
  const body: CategoryListResponse = await listCategories();
  response.json(body);
});

categoryRouter.post(createCategoryEndpoint.path, async (request, response) => {
  const { name } = createCategoryEndpoint.body.parse(request.body);
  const body: CategoryResponse = await createCategory(name);
  response.status(CREATED_STATUS).json(body);
});
