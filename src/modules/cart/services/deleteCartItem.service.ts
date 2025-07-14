import { CartModel } from '../models/cart.model';

export const removeItemFromCartService = async (userId: number, productId: number) => {
  const result = await CartModel.removeItemFromCart(userId, productId)

   return {
    success: true,
    productId: result.productId,
    itemsRemoved: result.itemsRemoved,
    newTotal: result.newTotal
  };
};
