import { PrismaClient } from '../../../../generated/prisma';
import { CreateProduct } from '../interfaces/createProduct.type';
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
}
