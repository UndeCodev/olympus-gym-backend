import { Request, Response } from 'express';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { createPlanSchema, getDeletePlanSchema, updatePlanSchema } from '../schemas/membership_plans.schema';
import { createPlanService } from '../services/create_plan.service';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { getPlansService } from '../services/get_plans.service';
import { getPlanByIdService } from '../services/getPlanById.service';
import { updatePlanService } from '../services/updatePlan.service';
import { deletePlanService } from '../services/deletePlan.service';

export class MembershipPlanController {
  static async create(req: Request, res: Response) {
    const body = await validateSchema(createPlanSchema, req.body);
    const plan = await createPlanService(body);

    res.status(HttpCode.CREATED).json({
      message: 'Plan de membresía creado exitosamente',
      data: plan,
    });
  }

  static async findAll(_req: Request, res: Response) {
    const plans = await getPlansService();

    res.status(HttpCode.OK).json({
      message: 'Planes obtenidos exitosamente',
      data: plans,
    });
  }

  static async findById(req: Request, res: Response) {
    const { params } = await validateSchema(getDeletePlanSchema, req);
    const plan = await getPlanByIdService(params);

    res.status(HttpCode.OK).json({
      message: 'Plan obtenido exitosamente',
      data: plan,
    });
  }

  static async update(req: Request, res: Response) {
    const validated = await validateSchema(updatePlanSchema, {
      params: req.params,
      body: req.body,
    });

    const updatedPlan = await updatePlanService(validated.params, validated.body);

    res.status(HttpCode.OK).json({
      message: 'Plan actualizado exitosamente',
      data: updatedPlan,
    });
  }

  static async delete(req: Request, res: Response) {
    const { params } = await validateSchema(getDeletePlanSchema, req);
    await deletePlanService(params);

    res.status(HttpCode.OK).json({
      message: 'Plan desactivado exitosamente',
    });
  }
}
