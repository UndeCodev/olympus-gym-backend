import { Request, Response } from "express";
import { validateSchema } from "../../../shared/utils/zodSchemaValidator";
import { updateProfileSchema } from "../schemas/profile.schema";
import { updateProfileService } from "../services/update-profile.service";

export class ProfileController{
  static async updateProfile(req: Request, res: Response) {
    const userId = Number(res.locals.user);
    const { firstName, lastName, phoneNumber, email } = await validateSchema(updateProfileSchema, req.body);

    const profileUpdated = await updateProfileService(userId, { firstName, lastName, phoneNumber, email });
    
    res.json(profileUpdated)
  }
}