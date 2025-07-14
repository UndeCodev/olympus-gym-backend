import { Prisma, PrismaClient } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';

const prisma = new PrismaClient();

export class CartModel {
  static async getOrCreateUserCart(userId: number) {
    return await prisma.$transaction(async (tx) => {
      let cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                    select: { url: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!cart) {
        cart = await tx.cart.create({
          data: {
            user: { connect: { id: userId } },
            total: 0.0,
          },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                      select: { url: true },
                    },
                  },
                },
              },
            },
          },
        });
      }

      return cart;
    });
  }

  static async addItem(userId: number, productId: number, quantity?: number) {
    return await prisma.$transaction(async (tx) => {
      // Common validations
      const { product, cart } = await this.validateItemOperation(userId, productId, quantity || 1);

      if (!cart) {
        throw new AppError({
          httpCode: HttpCode.NOT_FOUND,
          description: 'Carrito no encontrado',
        });
      }

      const existingItem = await tx.cart_item.findFirst({
        where: { cartId: cart.id, productId },
      });

      // Create or update cart item
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          throw new AppError({
            httpCode: HttpCode.CONFLICT,
            description: 'No hay suficiente stock disponible',
          });
        }

        const updatedItem = await tx.cart_item.update({
          where: { id: existingItem.id },
          data: { quantity: { increment: quantity || 1 } },
          include: { product: true },
        });

        await this.updateCartTotal(cart.id, Number(existingItem.price.toFixed(2)), tx);
        return updatedItem;
      }

      const newItem = await tx.cart_item.create({
        data: {
          cartId: cart.id,
          productId,
          price: Number(product.price.toFixed(2)),
          quantity: quantity || 1,
          name: product.name,
          category: product.category.name,
        },
        include: { product: true },
      });

      await this.updateCartTotal(cart.id, Number(product.price.toFixed(2)), tx);
      return newItem;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async addItemsBatch(userId: number, items: Array<{ productId: number; quantity?: number }>, retries = 3): Promise<any> {
    try {
      return await prisma.$transaction(
        async (tx) => {
          // 1. Bloquear el carrito y verificar existencia
          const cart = await tx.cart.findUnique({
            where: { userId },
            include: { items: true },
          });

          if (!cart) {
            throw new AppError({
              httpCode: HttpCode.NOT_FOUND,
              description: 'Carrito no encontrado',
            });
          }

          // 2. Obtener información de todos los productos de una vez
          const productIds = items.map((item) => item.productId);
          const products = await tx.product.findMany({
            where: { id: { in: productIds } },
            include: { category: true },
          });

          // 3. Validar stock y preparar operaciones
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const operations: Promise<any>[] = [];
          const existingItemsMap = new Map(cart.items.map((item) => [item.productId, item]));

          for (const { productId, quantity = 1 } of items) {
            const product = products.find((p) => p.id === productId);
            if (!product) {
              throw new AppError({
                httpCode: HttpCode.NOT_FOUND,
                description: `Producto con ID ${productId} no encontrado`,
              });
            }

            const existingItem = existingItemsMap.get(productId);
            const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

            if (newQuantity > product.stock) {
              throw new AppError({
                httpCode: HttpCode.CONFLICT,
                description: `No hay suficiente stock para el producto ${product.name}`,
              });
            }

            if (existingItem) {
              operations.push(
                tx.cart_item.update({
                  where: { id: existingItem.id },
                  data: { quantity: { increment: quantity } },
                }),
              );
            } else {
              operations.push(
                tx.cart_item.create({
                  data: {
                    cartId: cart.id,
                    productId,
                    price: Number(product.price.toFixed(2)),
                    quantity,
                    name: product.name,
                    category: product.category.name,
                  },
                }),
              );
            }
          }

          // 4. Ejecutar todas las operaciones en paralelo dentro de la transacción
          const results = await Promise.all(operations);

          // 5. Calcular y actualizar el total del carrito
          const totalIncrement = items.reduce((sum, { productId, quantity = 1 }) => {
            const product = products.find((p) => p.id === productId)!;
            return sum + product.price * quantity;
          }, 0);

          await tx.cart.update({
            where: { id: cart.id },
            data: { total: { increment: Number(totalIncrement.toFixed(2)) } },
          });

          return results;
        },
        {
          maxWait: 5000,
          timeout: 10000,
        },
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034' && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 100 * (4 - retries)));
        return this.addItemsBatch(userId, items, retries - 1);
      }
      throw error;
    }
  }

  static async updateItem(userId: number, productId: number, newQuantity: number) {
    return await prisma.$transaction(async (tx) => {
      // Validaciones comunes
      const { cart } = await this.validateItemOperation(userId, productId, newQuantity);

      if (!cart) {
        throw new AppError({
          httpCode: HttpCode.NOT_FOUND,
          description: 'Carrito no encontrado',
        });
      }

      // Verificar que el item EXISTA
      const existingItem = await tx.cart_item.findFirst({
        where: { cartId: cart.id, productId },
        include: { product: true },
      });

      if (!existingItem) {
        throw new AppError({
          httpCode: HttpCode.NOT_FOUND,
          description: 'Producto no encontrado en el carrito. Use addItem en su lugar.',
        });
      }

      // Calcular diferencia
      const quantityDifference = newQuantity - existingItem.quantity;
      const priceDifference = Number((existingItem.price * quantityDifference).toFixed(2));

      // Actualizar item
      const cartItem = await tx.cart_item.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });

      await this.updateCartTotal(cart.id, priceDifference, tx);

      return cartItem;
    });
  }

  static async removeItemFromCart(userId: number, productId: number) {
    return await prisma.$transaction(async (tx) => {
      // 1. Get user cart
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            where: { productId },
            select: { id: true, price: true, quantity: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new AppError({
          httpCode: HttpCode.NOT_FOUND,
          description: 'Producto no encontrado en el carrito',
        });
      }

      const item = cart.items[0];
      const amountToSubtract = Number((item.price * item.quantity).toFixed(2));

      // 2. Delete item
      await tx.cart_item.delete({
        where: { id: item.id },
      });

      // 3. Update cart total
      const updatedCart = await tx.cart.update({
        where: { id: cart.id },
        data: {
          total: { decrement: amountToSubtract },
        },
      });

      return {
        productId,
        itemsRemoved: item.quantity,
        newTotal: updatedCart.total,
      };
    });
  }

  static async clearCart(cartId: number) {
    await prisma.cart_item.deleteMany({
      where: { cartId },
    });

    // Reset cart total
    await prisma.cart.update({
      where: { id: cartId },
      data: { total: 0.0 },
    });
  }

  private static async validateItemOperation(userId: number, productId: number, quantity: number) {
    if (quantity <= 0) {
      throw new AppError({
        httpCode: HttpCode.BAD_REQUEST,
        description: 'La cantidad debe ser mayor a 0',
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });

    if (!product || product.stock < quantity) {
      throw new AppError({
        httpCode: HttpCode.CONFLICT,
        description: product ? 'Stock insuficiente' : 'Producto no encontrado',
      });
    }

    const cart = await this.getOrCreateUserCart(userId);
    return { product, cart };
  }

  private static async updateCartTotal(cartId: number, amount: number, tx: Prisma.TransactionClient) {
    await tx.cart.update({
      where: { id: cartId },
      data: {
        total: { increment: amount },
        updatedAt: new Date(),
      },
    });
  }
}
