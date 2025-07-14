import { formatCartItemResponse } from "../helpers/formatCartItemResponse.helper";
import { UpdateCartRequest } from "../interfaces/update-cart-request.interface";
import { CartModel } from "../models/cart.model";

export const updateCartItemService = async (userId: number, { productId, newQuantity }: UpdateCartRequest) => {
  const cartItem = await CartModel.updateItem(userId, productId, newQuantity);
  
  return formatCartItemResponse(cartItem);
};