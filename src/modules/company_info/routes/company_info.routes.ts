import { Router } from "express";
import { CompanyInfoController } from "../controllers/company_info.controller";

export const companyInfoRoutes = Router();

companyInfoRoutes.get("/", CompanyInfoController.getCompanyInfo);
companyInfoRoutes.patch("/", CompanyInfoController.updateCompanyInfo);