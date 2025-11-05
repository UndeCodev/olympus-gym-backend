import { Request, Response } from 'express';

import { HttpCode } from '../../../shared/interfaces/HttpCode';

import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import {
  createMuscleGroupSchema,
  deleteMuscleGroupParamsSchema,
  getMuscleGroupByIdSchema,
  getMuscleGroupsSchema,
  updateMuscleGroupBodySchema,
  updateMuscleGroupParamsSchema,
} from '../schemas/muscle_group.schema';
import { createMuscleGroupService } from '../services/create_muscle_group.service';
import { findAllMuscleGroupsService } from '../services/find_all_muscle_groups.service';
import { findMuscleGroupByIdService } from '../services/find_muscle_group_by_id.service';
import { updateMuscleGroupService } from '../services/update_muscle_group.service';
import { deleteMuscleGroupService } from '../services/delete_muscle_group.service';

export class MuscleGroupController {
  static async create(req: Request, res: Response) {
    const validatedData = await validateSchema(createMuscleGroupSchema, req.body);

    const newMuscleGroup = await createMuscleGroupService(validatedData);

    res.status(HttpCode.CREATED).json(newMuscleGroup);
  }

  static async findAll(req: Request, res: Response) {
    const query = await validateSchema(getMuscleGroupsSchema, req.query);

    const muscleGroups = await findAllMuscleGroupsService(query);

    res.json({ muscleGroups });
  }

  static async findById(req: Request, res: Response) {
    const params = await validateSchema(getMuscleGroupByIdSchema, req.params);

    const muscleGroup = await findMuscleGroupByIdService(params);

    res.json({ muscleGroup });
  }

  static async update(req: Request, res: Response) {
    const params = await validateSchema(updateMuscleGroupParamsSchema, req.params);

    const body = await validateSchema(updateMuscleGroupBodySchema, req.body);

    const updatedMuscleGroup = await updateMuscleGroupService(params, body);

    res.json({ updatedMuscleGroup });
  }

  static async delete(req: Request, res: Response) {
    const params = await validateSchema(deleteMuscleGroupParamsSchema, req.params);

    await deleteMuscleGroupService(params);

    res.sendStatus(HttpCode.NO_CONTENT);
  }
}
