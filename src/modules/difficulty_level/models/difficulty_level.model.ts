import { Prisma, PrismaClient } from '../../../../generated/prisma';
import { CreateDifficultyLevelBody } from '../interfaces/create_difficulty_level_body.interface';
import { GetDifficultyLevelsQuery } from '../interfaces/get_difficulty_level_query.interface';
import { UpdateDifficultyLevelBody } from '../interfaces/update_difficulty_level_body.interface';

const prisma = new PrismaClient();

export class DifficultyLevelModel {
  static async create(data: CreateDifficultyLevelBody) {
    return await prisma.difficulty_level.create({
      data: {
        name: data.name,
      },
    });
  }

  static async findByName(name: string) {
    return await prisma.difficulty_level.findUnique({
      where: {
        name: name,
      },
    });
  }

  static async findAll(query: GetDifficultyLevelsQuery) {
    const whereClause: Prisma.difficulty_levelWhereInput = {};
    if (query.search) {
      whereClause.name = {
        contains: query.search,
      };
    }
    return await prisma.difficulty_level.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });
  }

  static async findById(id: number) {
    return await prisma.difficulty_level.findUnique({
      where: { id },
    });
  }

  static async update(id: number, data: UpdateDifficultyLevelBody) {
    return await prisma.difficulty_level.update({
      where: { id },
      data: { name: data.name },
    });
  }

  static async delete(id: number) {
    return await prisma.difficulty_level.delete({
      where: { id },
    });
  }
}
