import { PrismaClient } from "../../../../generated/prisma";
import { AssignRoutineBody } from "../interfaces/assign_routine_body.interface";

const prisma = new PrismaClient();

export class UserRoutineModel {
  static async create(data: AssignRoutineBody) {
    return await prisma.user_routine_assignment.create({
      data: {
        userId: data.userId,
        masterRoutineId: data.masterRoutineId,
        // assignmentDate se establece por default(now())
      },
      include: {
        // Incluimos los datos del usuario (sin contraseña)
        user: {
          select: { 
            id: true, 
            firstName: true, 
            email: true, 
            rol: true
          }
        },
        // Incluimos los datos de la rutina asignada
        masterRoutine: true,
      }
    });
  }

  static async findByUserAndRoutine(data: AssignRoutineBody) {
    return await prisma.user_routine_assignment.findUnique({
      where: {
        // Nombre de la restricción unique generada por Prisma
        userId_masterRoutineId: {
          userId: data.userId,
          masterRoutineId: data.masterRoutineId,
        },
      },
    });
  }

  static async findByUserId(userId: number) {
    return await prisma.user_routine_assignment.findMany({
      where: {
        userId: userId,
      },
      include: {
        // Incluimos los detalles de la rutina maestra
        masterRoutine: true,
      },
      orderBy: {
        assignmentDate: 'desc',
      }
    });
  }

  static async findById(id: number) {
    return await prisma.user_routine_assignment.findUnique({
      where: { id },
    });
  }

  static async delete(id: number) {
    return await prisma.user_routine_assignment.delete({
      where: { id },
    });
  }
}

