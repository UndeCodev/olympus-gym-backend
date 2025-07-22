import { Prisma, PrismaClient } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { UpdateCompanyInfoInput } from '../interfaces/update-company-info-input.interface';

const prisma = new PrismaClient();

export class CompanyInfoModel {
  static async getCompanyInfo() {
    try {
      const companyInfo = await prisma.company_info.findFirstOrThrow({});

      return companyInfo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new AppError({
          httpCode: HttpCode.NOT_FOUND,
          description: 'No se encontró la información de la empresa',
        });
      }
    }
  }

  static async updateCompanyInfo(data: UpdateCompanyInfoInput) {
    try {
      const existingInfo = await prisma.company_info.findFirstOrThrow({});

      const companyInfo = await prisma.company_info.update({ where: { id: existingInfo.id }, data });

      return companyInfo;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new AppError({
          httpCode: HttpCode.NOT_FOUND,
          description: 'No se encontró la información de la empresa',
        });
      }
    }
  }
}
