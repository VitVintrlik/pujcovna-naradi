import { Prisma } from '../../generated/prisma/client';
import { recordAudit } from '../audit';
import { AppError } from '../errors';
import { prisma } from '../prisma';
import { toCategoryResponse } from './category.mapper';

const DUPLICATE_CATEGORY_MESSAGE = 'Kategorie s tímto názvem již existuje. Zadejte jiný název.';
const UNIQUE_CONSTRAINT_ERROR = 'P2002';
const CATEGORY_CREATE_ACTION = 'category.create';
const CATEGORY_ENTITY_TYPE = 'category';

enum CategoryActorRole {
  Worker = 'worker',
}

export const getCategoryByName = async (name: string) =>
  prisma.category.findUnique({
    where: { name },
  });

// The database constraint also protects against concurrent duplicates.
export const ensureCategoryNameAvailable = async (name: string) => {
  const existingCategory = await getCategoryByName(name);
  if (existingCategory !== null) {
    throw new AppError('VALIDATION_FAILED', DUPLICATE_CATEGORY_MESSAGE);
  }
};

export const listCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  return categories.map(toCategoryResponse);
};

export const createCategory = async (name: string, actorId: string) => {
  await ensureCategoryNameAvailable(name);

  try {
    const category = await prisma.$transaction(async (transaction) => {
      const createdCategory = await transaction.category.create({
        data: { name },
      });

      // A failed audit write must roll back the category creation.
      await recordAudit(transaction, {
        actorId,
        actorRole: CategoryActorRole.Worker,
        action: CATEGORY_CREATE_ACTION,
        entityType: CATEGORY_ENTITY_TYPE,
        entityId: createdCategory.id,
      });

      return createdCategory;
    });

    return toCategoryResponse(category);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === UNIQUE_CONSTRAINT_ERROR &&
      Array.isArray(error.meta?.target) &&
      error.meta.target.includes('name')
    ) {
      throw new AppError('VALIDATION_FAILED', DUPLICATE_CATEGORY_MESSAGE);
    }

    throw error;
  }
};
