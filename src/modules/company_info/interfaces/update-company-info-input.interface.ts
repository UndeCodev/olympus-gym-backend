import { z } from "zod";
import { updateCompanyInfoSchema } from "../schemas/company_info.schema";

export type UpdateCompanyInfoInput = z.infer<typeof updateCompanyInfoSchema>;