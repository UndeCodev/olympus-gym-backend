import { ProfileUpdateRequestInterface } from "../interfaces/profile-update-request.interface";
import { ProfileModel } from "../models/profile.model";

export const updateProfileService = async (userId: number, data: ProfileUpdateRequestInterface) => {
  const profileUpdated = await ProfileModel.updateProfile(userId, data);

  return profileUpdated
};