import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { PlanParams } from '../interfaces/plan_params.interface';
import { UpdatePlanBody } from '../interfaces/update_plan_body.interface';
import { MembershipPlanModel } from '../models/membership_plans.model';

export const updatePlanService = async (params: PlanParams, body: UpdatePlanBody) => {
  const { id } = params;

  // Verificar existencia
  const existingPlan = await MembershipPlanModel.findById(id);
  if (!existingPlan) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Plan no encontrado',
    });
  }

  // Verificar duplicado de nombre si se actualiza
  if (body.name) {
    const duplicate = await MembershipPlanModel.findByName(body.name);
    if (duplicate && duplicate.id !== id) {
      throw new AppError({
        httpCode: HttpCode.CONFLICT,
        description: 'Ya existe otro plan con este nombre',
      });
    }
  }

  return await MembershipPlanModel.update(id, body);
};