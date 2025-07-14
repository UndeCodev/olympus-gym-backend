import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

export class ProductBrandsModel {
  static async getAllProductBrands() {
    return await prisma.product_brand.findMany();
  }
}
