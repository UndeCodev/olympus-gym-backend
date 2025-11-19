import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { PlanParams } from '../interfaces/plan_params.interface';
import { MembershipPlanModel } from '../models/membership_plans.model';

export const getPlanByIdService = async (params: PlanParams) => {
  const plan = await MembershipPlanModel.findById(params.id);

  if (!plan) {
    throw new AppError({
      httpCode: HttpCode.NOT_FOUND,
      description: 'Plan de membresía no encontrado',
    });
  }
  return plan;
};