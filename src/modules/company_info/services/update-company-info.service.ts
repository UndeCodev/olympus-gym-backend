import { UpdateCompanyInfoInput } from "../interfaces/update-company-info-input.interface";
import { CompanyInfoModel } from "../models/company_info.model";

export const updateCompanyInfoService = async(dataToUpdate: UpdateCompanyInfoInput) => {
  const companyInfoUpdated = await CompanyInfoModel.updateCompanyInfo(dataToUpdate);

  return companyInfoUpdated;
}