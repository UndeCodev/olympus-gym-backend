import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { CartModel } from '../models/cart.model';

export const getCartService = async (userId: number) => {
  const cart = await CartModel.getOrCreateUserCart(userId);

  if (!cart) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Carrito no encontrado',
    });
  }

  return {
    id: cart.id,
    total: cart.total,
    items: cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      stock: item.product.stock,
      price: item.price,
      quantity: item.quantity,
      category: item.category,
      image: item.product.images[0].url,
    })),
  };
};
