import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { validateQrSchema } from '../schemas/access.schema';
import { validateQrService } from '../services/validateQr.service';
import { HttpCode } from '../../../shared/interfaces/HttpCode';

export class AccessControlController {
  static async validate(req: Request, res: Response) {
    const body = await validateSchema(validateQrSchema, req.body);
    const result = await validateQrService(body);

    res.status(HttpCode.OK).json({
      message: 'Validación completada',
      data: result,
    });
  }
}
