import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { assignMembershipSchema, cancelMembershipSchema, getUserHistorySchema, renewMembershipSchema } from '../schemas/memberships.schema';
import { assignMembershipService } from '../services/assign_membership.service';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { getMyStatusService } from '../services/getMyStatus.service';
import { renewMembershipService } from '../services/renewMembership.service';
import { cancelMembershipService } from '../services/cancelMembership.service';
import { getUserHistoryService } from '../services/getUserHistory.service';

export class MembershipController {
  static async assign(req: Request, res: Response) {
    const body = await validateSchema(assignMembershipSchema, req.body);

    const membership = await assignMembershipService(body);

    res.status(HttpCode.CREATED).json({
      message: 'Membresía asignada exitosamente',
      data: membership,
    });
  }

  static async getMyStatus(_req: Request, res: Response) {
    if (!res.locals.user || !res.locals.user.id) {
      res.status(HttpCode.UNAUTHORIZED).json({ message: 'No autorizado' });
      return;
    }

    const statusData = await getMyStatusService(res.locals.user.id);

    res.status(HttpCode.OK).json({
      message: 'Estado de membresía obtenido',
      data: statusData,
    });
  }

  /** POST /renew - Extender fecha */
  static async renew(req: Request, res: Response) {
    const body = await validateSchema(renewMembershipSchema, req.body);
    const result = await renewMembershipService(body);

    res.status(HttpCode.OK).json({
      message: 'Membresía extendida exitosamente',
      data: result,
    });
  }

  /** POST /cancel - Cancelar suscripción */
  static async cancel(req: Request, res: Response) {
    const body = await validateSchema(cancelMembershipSchema, req.body);
    const result = await cancelMembershipService(body);

    res.status(HttpCode.OK).json({
      message: 'Membresía cancelada exitosamente',
      data: result,
    });
  }

  /** GET /user/:userId - Historial */
  static async getUserHistory(req: Request, res: Response) {
    const { params } = await validateSchema(getUserHistorySchema, req);
    const history = await getUserHistoryService(params);

    res.status(HttpCode.OK).json({
      message: 'Historial de membresías obtenido',
      data: history,
    });
  }
}
