import { formatCartItemResponse } from "../helpers/formatCartItemResponse.helper";
import { CartModel } from "../models/cart.model";

export const addItemService = async (userId: number, productId: number, quantity?: number) => {
  const cartItem = await CartModel.addItem(userId, productId, quantity);

  return formatCartItemResponse(cartItem)
};
