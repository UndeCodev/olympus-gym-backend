import { PrismaClient } from '../../../../generated/prisma';
import { User } from '../../../core/entities/User';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { AuthModel } from '../../auth/models/auth.model';

const prisma = new PrismaClient();

export class TrainerModel {
  static async createTrainer(trainerData: User) {
    const emailFound = await AuthModel.findUserByEmail(trainerData.email);

    if (emailFound) {
      throw new AppError({
        httpCode: HttpCode.CONFLIT,
        description: 'El correo electronico ya esta registrado',
      });
    }

    const trainer = await prisma.user.create({ data: { ...trainerData, rol: 'MOD' } });
    return trainer;
  }
}
