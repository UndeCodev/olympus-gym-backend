import { CompanyInfoModel } from "../models/company_info.model";

 export const getCompanyInfoService = async () => {
  const companyInfo = await CompanyInfoModel.getCompanyInfo();

  return companyInfo;
};