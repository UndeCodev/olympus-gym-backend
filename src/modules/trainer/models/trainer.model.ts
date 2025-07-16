import { Prisma, PrismaClient } from '../../../../generated/prisma';
import { AppError } from '../../../core/errors/AppError';
import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { CreateTrainer } from '../interfaces/create-trainer.interface';
import { EmployeeSearchResult } from '../interfaces/employeeSearchResult';
import { SearchEmployeeOptions } from '../interfaces/searchEmployeeOptions';
import { UpdateTrainerData } from '../interfaces/updateTrainer.interface';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class TrainerModel {
  static async getTrainerById(id: number) {
    const trainer = await prisma.employee.findUnique({ where: { id } });
    return trainer;
  }

  static async createTrainer(trainerData: CreateTrainer) {
    const hashedPassword = await bcrypt.hash(trainerData.password, 10);

    trainerData.password = hashedPassword;

    try {
      return await prisma.$transaction(async (tx) => {
        const userEmployeeCreated = await tx.user.create({
          data: {
            firstName: trainerData.firstName,
            lastName: trainerData.lastName,
            email: trainerData.email,
            birthDate: trainerData.birthDate,
            phoneNumber: trainerData.phoneNumber,
            password: trainerData.password,
            rol: 'MOD',
            emailVerified: true,
          },
          omit: {
            password: true,
            refreshToken: true,
            twoFactorEnabled: true,
          },
        });

        await tx.employee.create({ data: { userId: userEmployeeCreated.id, isActive: trainerData.isActive } });

        return userEmployeeCreated;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError({
          httpCode: HttpCode.CONFLICT,
          description: `El correo electronico ${trainerData.email} ya esta registrado`,
        });
      }
    }
  }

  static async getAllTrainers() {
    const trainers = await prisma.employee.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            birthDate: true,
            rol: true,
          },
        },
      },
      omit: { userId: true },
    });
    return trainers;
  }

  static async searchEmployees(options: SearchEmployeeOptions): Promise<EmployeeSearchResult> {
    const { term, page = 1, pageSize = 10, isActive } = options;

    const skip = (page - 1) * pageSize;

    const whereClause: Prisma.employeeWhereInput = {};

    if (term) {
      whereClause.user = {
        OR: [{ firstName: { contains: term } }, { lastName: { contains: term } }, { email: { contains: term } }],
      };
    }

    if (isActive !== undefined) {
      whereClause.isActive = isActive;
    }

    const [employees, totalCount] = await Promise.all([
      prisma.employee.findMany({
        where: whereClause,
        include: { user: true },
        skip,
        take: pageSize,
        orderBy: { id: 'desc' },
      }),
      prisma.employee.count({
        where: whereClause,
      }),
    ]);

    const formattedEmployees = employees.map((employee) => ({
      id: employee.id,
      isActive: employee.isActive,
      user: {
        firstName: employee.user.firstName,
        lastName: employee.user.lastName,
        email: employee.user.email,
        phoneNumber: employee.user.phoneNumber,
        birthDate: employee.user.birthDate,
        rol: employee.user.rol,
      },
    }));

    return {
      employees: formattedEmployees,
      pagination: {
        total: totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }

  static async updateTrainer(trainerId: number, trainerData: UpdateTrainerData) {
    const { firstName, lastName, phoneNumber, birthDate, email, password, isActive } = trainerData;

    try {
      const trainer = await prisma.employee.update({
        where: { id: trainerId },
        data: {
          isActive,
          user: {
            update: {
              firstName,
              lastName,
              phoneNumber,
              birthDate,
              email,
              password,
            },
          },
        },
        select: {
          id: true,
          isActive: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
              birthDate: true,
              rol: true,
            },
          },
        },
      });

      return trainer;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new AppError({
            httpCode: HttpCode.CONFLICT,
            description: `El correo electronico ${trainerData.email} ya esta registrado`,
          });
        }

        if (error.code === 'P2025') {
          throw new AppError({
            httpCode: HttpCode.NOT_FOUND,
            description: 'No se encontró el entrenador',
          });
        }
      }
    }
  }

  static async deleteTrainerById(trainerId: number) {
    try {
      const trainerDeleted = await prisma.employee.delete({ where: { id: trainerId } });

      await prisma.user.delete({ where: { id: trainerDeleted.userId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new AppError({
          httpCode: HttpCode.NOT_FOUND,
          description: 'No se encontró el entrenador',
        });
      }
    }
  }
}
