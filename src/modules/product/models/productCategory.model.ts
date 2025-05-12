import { PrismaClient } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';

const prisma = new PrismaClient();

export class ProductCategoryModel {
  static async getCategoryById(id: number) {
    const category = await prisma.product_category.findUnique({ where: { id } });
    return category;
  }

  static async getCategoryByName(name: string) {
    const category = await prisma.product_category.findUnique({ where: { name } });
    return category;
  }

  static async getAllCategories() {
    const categories = await prisma.product_category.findMany();
    return categories;
  }

  static async createCategory(name: string) {
    const existingCategory = await this.getCategoryByName(name);

    if (existingCategory) {
      throw new AppError({
        httpCode: HttpCode.CONFLIT,
        description: 'La categoría ya existe',
      });
    }

    try {
      await prisma.product_category.create({ data: { name } });
    } catch {
      throw new AppError({
        httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        isOperational: false,
        description: 'Ha ocurrido un error al crear la categoría',
      });
    }
  }

  static async updateCategory(id: number, name: string) {
    const existingCategory = await this.getCategoryById(id);

    if (!existingCategory) {
      throw new AppError({
        httpCode: HttpCode.CONFLIT,
        description: 'La categoría no existe',
      });
    }

    try {
      const categoryUpdated = await prisma.product_category.update({ where: { id }, data: { name } });

      return categoryUpdated;
    } catch {
      throw new AppError({
        httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        isOperational: false,
        description: 'Ha ocurrido un error al actualizar la categoría',
      });
    }
  }

  static async deleteCategoryById(id: number) {
    const existingCategory = await this.getCategoryById(id);

    if (!existingCategory) {
      throw new AppError({
        httpCode: HttpCode.CONFLIT,
        description: 'La categoría no existe',
      });
    }

    try {
      await prisma.product_category.delete({ where: { id } });
    } catch {
      throw new AppError({
        httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        isOperational: false,
        description: 'Ha ocurrido un error al eliminar la categoría',
      });
    }
  }
}
