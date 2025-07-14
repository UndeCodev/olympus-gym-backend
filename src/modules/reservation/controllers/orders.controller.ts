import { Request, Response } from 'express';

import { validateSchema } from '../../../shared/utils/zodSchemaValidator';

import { processWebhookService } from '../services/process-webhook.service';
import { createReservationSchema } from '../schemas/createReservation.schema';
import { createReservationService } from '../services/create-reservation.service';

export class ReservationController {
  static async createReservation(req: Request, res: Response) {
    const { cartId, userId } = await validateSchema(createReservationSchema, req.body);

    const initPoint = await createReservationService(cartId, userId);

    res.json({ initPoint });
  }

  static async receiveWebhook(req: Request, _res: Response) {
    const webhookData = req.body;

    await processWebhookService(webhookData);
  }
}
