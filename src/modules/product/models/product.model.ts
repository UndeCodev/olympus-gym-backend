import { PrismaClient, ProductStatus } from '../../../../generated/prisma';
import { CreateProduct } from '../interfaces/createProduct.type';
import { ProductPaginationOptions } from '../interfaces/productsPagination.interface';
import { UpdateProductData } from '../interfaces/updatedProduct.interface';

const prisma = new PrismaClient();

export class ProductModel {
  static async getProductById(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true },
      omit: { categoryId: true },
    });

    return product;
  }

  static async getProductByName(name: string) {
    const product = await prisma.product.findUnique({ where: { name } });

    return product;
  }

  static async getAllProducts() {
    const products = await prisma.product.findMany({
      include: { category: true, images: true },
      omit: { categoryId: true },
    });
    return products;
  }

  static async createProduct(productData: CreateProduct) {
    const { name, description, stock, categoryId, price, images: imagesData } = productData;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        categoryId,
        images: {
          create: imagesData,
        },
      },
      include: {
        images: true,
      },
    });

    return product;
  }

  static async updateProductById(id: number, productData: UpdateProductData) {
    await prisma.product.update({ where: { id }, data: productData });
  }

  static async deleteProductById(id: number) {
    await prisma.$transaction(async (tx) => {
      await tx.product_image.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
    });
  }

  static async searchProducts(searchTerm: string) {
    const products = await prisma.product.findMany({
      where: {
        OR: [{ name: { contains: searchTerm } }, { description: { contains: searchTerm } }],
      },
      include: {
        category: true,
        images: true,
      },
      omit: { categoryId: true },
      take: 10, // Limit of results
    });

    return products;
  }

  static async getPaginatedProducts(options: ProductPaginationOptions) {
    const {
      page = 1,
      limit = 10,
      search = '',
      categoryId,
      minPrice,
      maxPrice,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    // Construcción tipada correctamente del objeto where
    const where = {
      AND: [
        {
          OR: [{ name: { contains: search } }, { description: { contains: search } }],
        },
        ...(categoryId ? [{ categoryId }] : []),
        ...(minPrice ? [{ price: { gte: minPrice } }] : []),
        ...(maxPrice ? [{ price: { lte: maxPrice } }] : []),
        ...(status ? [{ status: status as ProductStatus }] : []),
      ],
    };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: true,
          images: true,
        },
      }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
