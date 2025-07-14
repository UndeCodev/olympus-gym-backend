import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

export class ProductPresentationsModel {
  static async getAllProductPresentations() {
    return await prisma.product_presentation.findMany();
  }
}
