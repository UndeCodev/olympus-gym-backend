import { CartItemWithProduct } from '../interfaces/cart-item-with-product.interface';

export const formatCartItemResponse = (cartItem: CartItemWithProduct) => ({
  id: cartItem.id,
  productId: cartItem.productId,
  name: cartItem.name,
  price: cartItem.price,
  quantity: cartItem.quantity,
  category: cartItem.category,
  currentPrice: cartItem.product.price,
  priceLocked: cartItem.price !== cartItem.product.price,
});
