import { Prisma } from '../../generated/prisma/client';
import { AppError } from '@pujcovna/server';
import { prisma } from '../prisma';
import { toCategoryResponse } from './category.mapper';

const DUPLICATE_CATEGORY_MESSAGE = 'Kategorie s tímto názvem již existuje. Zadejte jiný název.';
const UNIQUE_CONSTRAINT_ERROR = 'P2002';

const isDuplicateNameError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === UNIQUE_CONSTRAINT_ERROR &&
  Array.isArray(error.meta?.target) &&
  error.meta.target.includes('name');

export const listCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  return categories.map(toCategoryResponse);
};

export const createCategory = async (name: string) => {
  try {
    return toCategoryResponse(await prisma.category.create({ data: { name } }));
  } catch (error) {
    if (isDuplicateNameError(error)) {
      throw new AppError('VALIDATION_FAILED', DUPLICATE_CATEGORY_MESSAGE);
    }

    throw error;
  }
};
