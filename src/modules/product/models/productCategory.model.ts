import { Prisma, PrismaClient } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';

const prisma = new PrismaClient();

export class ProductCategoryModel {
  static async getCategoryById(id: number) {
    const category = await prisma.product_category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
    return category;
  }

  static async getCategoryByName(name: string) {
    const category = await prisma.product_category.findUnique({
      where: { name },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
    return category;
  }

  static async getPaginatedCategories(searchTerm?: string, page: number = 1, limit: number = 10) {
    const whereClause = {
      AND: [
        {
          OR: [{ name: { contains: searchTerm } }, { description: { contains: searchTerm } }],
        },
      ],
    };

    const [products, total] = await Promise.all([
      prisma.product_category.findMany({
        where: whereClause,
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product_category.count({ where: whereClause }),
    ]);

    return {
      categories: products,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getAllCategories() {
    const categories = await prisma.product_category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
    return categories;
  }

  static async createCategory(name: string, description?: string, isActive?: boolean) {
    const existingCategory = await this.getCategoryByName(name);

    if (existingCategory) {
      throw new AppError({
        httpCode: HttpCode.CONFLICT,
        description: `La categoría ${name} ya está registrada.`,
      });
    }

    try {
      const category = await prisma.product_category.create({ data: { name, description, isActive } });
      return category;
    } catch {
      throw new AppError({
        httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        isOperational: false,
        description: 'Ha ocurrido un error al crear la categoría',
      });
    }
  }

  static async updateCategory(id: number, name?: string, description?: string, isActive?: boolean) {
    try {
      const categoryUpdated = await prisma.product_category.update({
        where: {
          id,
          ...(name && {
            NOT: {
              name,
              id: { not: id },
            },
          }),
        },
        data: { name, description, isActive },
      });

      return categoryUpdated;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new AppError({
            httpCode: HttpCode.CONFLICT,
            description: `La categoría ${name} ya está registrada.`,
          });
        }
      }

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
        httpCode: HttpCode.CONFLICT,
        description: 'La categoría no existe',
      });
    }

    const productsCount = existingCategory._count.products;

    if (productsCount > 0) {
      throw new AppError({
        httpCode: HttpCode.CONFLICT,
        description: `No se puede eliminar la categoría porque tiene ${productsCount} producto(s) asociado(s)`,
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
