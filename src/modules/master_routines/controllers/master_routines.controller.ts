import { Request, Response } from 'express';

import { HttpCode } from '../../../shared/interfaces/HttpCode';
import { validateSchema } from '../../../shared/utils/zodSchemaValidator';
import { createMasterRoutineService } from '../services/create_master_routine.service';
import {
  createMasterRoutineSchema,
  getDeleteMasterRoutineSchema,
  getMasterRoutinesSchema,
  updateMasterRoutineSchema,
} from '../schemas/master_routines.schema';
import { getMasterRoutinesService } from '../services/get_master_routines.service';
import { getMasterRoutineByIdService } from '../services/get_master_routine_by_id.service';
import { updateMasterRoutineService } from '../services/update_master_routine.service';
import { deleteMasterRoutineService } from '../services/delete_master_routine.service';

export class MasterRoutinesController {
  static async create(req: Request, res: Response) {
    const body = await validateSchema(createMasterRoutineSchema, req.body);

    // 2. Llamar al servicio funcional
    const newMasterRoutine = await createMasterRoutineService(body);

    // 3. Devolver respuesta
    res.status(HttpCode.CREATED).json({
      // 201
      message: 'Rutina maestra creada exitosamente',
      data: newMasterRoutine,
    });
  }

  static async findAll(req: Request, res: Response) {
    const { query } = await validateSchema(getMasterRoutinesSchema, req);
    const routines = await getMasterRoutinesService(query);

    res.status(HttpCode.OK).json({
      message: 'Rutinas maestras obtenidas exitosamente',
      data: routines,
    });
  }

  static async findById(req: Request, res: Response) {
    const { params } = await validateSchema(getDeleteMasterRoutineSchema, req);
    const routine = await getMasterRoutineByIdService(params);

    res.status(HttpCode.OK).json({
      message: 'Rutina maestra obtenida exitosamente',
      data: routine,
    });
  }

  static async update(req: Request, res: Response) {
    const validated = await validateSchema(updateMasterRoutineSchema, {
      params: req.params,
      body: req.body,
    });

    const updatedRoutine = await updateMasterRoutineService(validated.params, validated.body);

    res.status(HttpCode.OK).json({
      message: 'Rutina maestra actualizada exitosamente',
      data: updatedRoutine,
    });
  }

  static async delete(req: Request, res: Response) {
    const { params } = await validateSchema(getDeleteMasterRoutineSchema, req);
    await deleteMasterRoutineService(params);

    res.status(HttpCode.OK).json({
      message: 'Rutina maestra eliminada exitosamente',
    });
  }
}
