import { PrismaClient } from '../../../../generated/prisma';
import { CreateProduct } from '../interfaces/createProduct.type';

const prisma = new PrismaClient();

export class ProductModel {
  static async getProductById(id: number) {
    const product = await prisma.product.findUnique({ where: { id } });

    return product;
  }

  static async getProductByName(name: string) {
    const product = await prisma.product.findUnique({ where: { name } });

    return product;
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
}
