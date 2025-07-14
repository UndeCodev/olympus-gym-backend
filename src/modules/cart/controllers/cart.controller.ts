import { Request, Response } from 'express';
import { HttpCode } from '../../../shared/interfaces/HttpCode';

import {
  addCartItemSchema,
  addCartItemsSchema,
  deleteCartItemSchema,
  updateCartItemSchema,
} from '../schemas/cart.schema';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';

import { getCartService } from '../services/getCart.service';
import { addItemService } from '../services/addItem.service';
import { updateCartItemService } from '../services/updateCartItem.service';
import { removeItemFromCartService } from '../services/deleteCartItem.service';
import { clearCartService } from '../services/clearCart.service';
import { addItemsBatchService } from '../services/add-items-batch.service';

export class CartController {
  static async getCart(_req: Request, res: Response) {
    const userId = Number(res.locals?.user);

    const cart = await getCartService(userId);

    res.status(200).json({ cart });
  }

  static async addItem(req: Request, res: Response) {
    const userId = Number(res.locals?.user);
    const { productId } = await validateSchema(addCartItemSchema, req.body);

    const item = await addItemService(userId, productId);

    res.status(HttpCode.CREATED).json({ item });
  }

  static async addItems(req: Request, res: Response) {
    const userId = Number(res.locals?.user);
    const { items } = await validateSchema(addCartItemsSchema, req.body);

    const result = await addItemsBatchService(userId, items);

    res.status(HttpCode.CREATED).json(result);
  }

  static async updateItem(req: Request, res: Response) {
    const userId = Number(res.locals?.user);
    const { productId, newQuantity } = await validateSchema(updateCartItemSchema, req.body);

    const item = await updateCartItemService(userId, { productId, newQuantity });

    res.status(HttpCode.CREATED).json({ item });
  }

  static async deleteCartItem(req: Request, res: Response) {
    const userId = Number(res.locals?.user);
    const { productId } = await validateSchema(deleteCartItemSchema, req.params);

    const result = await removeItemFromCartService(userId, productId);

    res.json(result);
  }

  static async clearCart(_req: Request, res: Response) {
    const userId = parseInt(res.locals?.user);

    const result = await clearCartService(userId);

    res.status(200).json(result);
  }
}
