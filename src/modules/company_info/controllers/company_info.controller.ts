import { Request, Response } from 'express';
import { getCompanyInfoService } from '../services/get-company-info.service';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { updateCompanyInfoSchema } from '../schemas/company_info.schema';
import { updateCompanyInfoService } from '../services/update-company-info.service';

export class CompanyInfoController {
  static async getCompanyInfo(_req: Request, res: Response) {
    const companyInfo = await getCompanyInfoService();

    res.json(companyInfo );
  }

  static async updateCompanyInfo(req: Request, res: Response) {
    const { logo, name, slogan, address, zip, phoneNumber, email, schedule, socialMedia } = await validateSchema(
      updateCompanyInfoSchema,
      req.body,
    );

    const companyInfoUpdated = await updateCompanyInfoService({
      logo,
      name,
      slogan,
      address,
      zip,
      phoneNumber,
      email,
      schedule,
      socialMedia,
    });

    res.json(companyInfoUpdated);
  }
}
