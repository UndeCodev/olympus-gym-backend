import { UserHistoryParams } from '../interfaces/user_history_params.interface';
import { UserMembershipModel } from '../models/user_membership.model';

export const getUserHistoryService = async (params: UserHistoryParams) => {
  return await UserMembershipModel.findAllByUserId(params.userId);
};