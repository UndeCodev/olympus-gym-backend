import { PrismaClient } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { ProductImage } from '../interfaces/addImages.type';

const prisma = new PrismaClient();

export class ProductImagesModel {
  static async getImagesToDelete(productId: number, deletedImages: number[]) {
    const images = await prisma.product_image.findMany({ where: { id: { in: deletedImages }, productId } });

    if (!images) {
      throw new AppError({
        httpCode: HttpCode.NOT_FOUND,
        description: 'Las imagenes a eliminar no existen',
      });
    }

    return images;
  }

  static async deleteImages(ids: number[]) {
    await prisma.product_image.deleteMany({ where: { id: { in: ids } } });
  }

  static async addImages(productId: number, images: ProductImage[]) {
    return await prisma.product_image.createMany({
      data: images.map((img) => ({
        ...img,
        productId,
      })),
    });
  }

  static async updateProductPrimaryImage(productId: number, imageId: number) {
    const imageFound = await prisma.product_image.findUnique({
      where: {
        id: imageId,
        productId,
      },
    });

    if (!imageFound) {
      throw new AppError({
        httpCode: HttpCode.NOT_FOUND,
        description: 'La imagen primaria especificada no pertenece a este producto',
      });
    }

    if (imageFound.isPrimary) return;

    await prisma.$transaction([
      // First set all images as not primary
      prisma.product_image.updateMany({
        where: {
          productId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      }),

      // Then set the new image as primary
      prisma.product_image.update({
        where: {
          id: imageId,
          productId,
        },
        data: {
          isPrimary: true,
        },
      }),
    ]);
  }
}
