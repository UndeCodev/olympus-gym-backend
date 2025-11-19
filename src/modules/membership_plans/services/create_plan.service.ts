import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { CreatePlanBody } from '../interfaces/create_plan_body.interface';
import { MembershipPlanModel } from '../models/membership_plans.model';

export const createPlanService = async (body: CreatePlanBody) => {
  const { name } = body;

  const existingPlan = await MembershipPlanModel.findByName(name);
  if (existingPlan) {
    throw new AppError({
      httpCode: HttpCode.CONFLICT,
      description: 'Ya existe un plan con este nombre',
    });
  }

  return await MembershipPlanModel.create(body);
};