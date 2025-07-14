import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { CartModel } from '../models/cart.model';

export const clearCartService = async (userId: number) => {
  const cart = await CartModel.getOrCreateUserCart(userId);

  if(!cart){
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Carrito no encontrado',
    })
  }
  
  await CartModel.clearCart(cart.id);
};
