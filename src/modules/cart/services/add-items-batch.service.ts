// import { formatCartItemResponse } from '../helpers/formatCartItemResponse.helper';
import { CartModel } from '../models/cart.model';

interface AddItemsBatchRequest {
  productId: number;
  quantity: number;
}

export const addItemsBatchService = async (userId: number, items: AddItemsBatchRequest[]) => {
  const cartItems = await CartModel.addItemsBatch(userId, items);

  return cartItems
};
