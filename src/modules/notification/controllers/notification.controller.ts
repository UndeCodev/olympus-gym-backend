import { Request, Response } from 'express';
import { NotificationModel } from '../../notifications/models/notification.model';

import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { addCartItemSchema, userIdSchema, verificationSchema } from '../schemas/notification.schema';
import { addItemService } from '../../cart/services/addItem.service';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { getCartService } from '../../cart/services/getCart.service';

export class NotificationController {
  static async getNotificationsByVerificationCode(req: Request, res: Response) {
    const { verificationCode } = await validateSchema(verificationSchema, req.body);

    const user = await NotificationModel.getNotificationsByVerificationCode(verificationCode);

    res.json({ user });
  }

  static async getCart(req: Request, res: Response) {
    const { userId } = await validateSchema(userIdSchema, req.params);


    const cart = await getCartService(userId);

    res.status(200).json({ cart });
  }

  static async addCartItem(req: Request, res: Response) {
    const { userId, productId, quantity } = await validateSchema(addCartItemSchema, req.body);

    const item = await addItemService(userId, productId, quantity);

    res.status(HttpCode.CREATED).json({ item });
  }
}
