import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { PlanParams } from '../interfaces/plan_params.interface';
import { MembershipPlanModel } from '../models/membership_plans.model';

export const deletePlanService = async (params: PlanParams) => {
  const { id } = params;

  const existingPlan = await MembershipPlanModel.findById(id);
  if (!existingPlan) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Plan no encontrado',
    });
  }

  await MembershipPlanModel.softDelete(id);
};