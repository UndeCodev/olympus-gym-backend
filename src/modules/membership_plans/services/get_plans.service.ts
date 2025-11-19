import { MembershipPlanModel } from "../models/membership_plans.model";

export const getPlansService = async () => {
  const plans = await MembershipPlanModel.findAll(true);
  return plans;
};