import { PrismaClient } from '../../../../generated/prisma';
import { User } from '../../../core/entities/User';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { AuthModel } from '../../auth/models/auth.model';
import { UpdateTrainerData } from '../interfaces/updateTrainer.interface';

const prisma = new PrismaClient();

export class TrainerModel {
  static async getTrainerById(id: number) {
    const trainer = await prisma.user.findUnique({ where: { id, rol: 'MOD' } });
    return trainer;
  }

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

  static async getAllTrainers() {
    const trainers = await prisma.user.findMany({ where: { rol: 'MOD' } });
    return trainers;
  }

  static async updateTrainer(trainerId: number, trainerData: UpdateTrainerData) {
    const trainer = await prisma.user.update({
      where: { id: trainerId },
      data: trainerData,
      omit: { password: true, refreshToken: true },
    });
    return trainer;
  }
}
