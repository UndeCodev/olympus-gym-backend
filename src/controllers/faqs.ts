import { NextFunction, Request, Response } from "express";
import { validateFaqCreation, validateFaqUpdate } from "../schemas/Faqs";
import { HttpCode } from "../enums";
import { FaqsModel } from "../models/faqs";


export class FaqsController {

    static async createFaq (req: Request, res: Response, next: NextFunction): Promise<void>{
        const resultValidationInputData = validateFaqCreation(req.body)

        if(!resultValidationInputData.success){
            res.status(400).json({
                message: 'Validation FAQ error.',
                errors: resultValidationInputData.error.format()
            })
            return
        }

        try {
            await FaqsModel.createFaq(resultValidationInputData.data)

            res.status(HttpCode.CREATED).json({
                message: 'Faq created sucessfully'
            })
        } catch (error) {
            next(error)
        }
    }

    static async updateFaq (req: Request, res: Response, next: NextFunction): Promise<void>{
        
        //get id
        const id = parseInt(req.params.id)
        if(isNaN(id)){
            res.status(400).json({
                message: 'Invalid ID'
            })
            return
        }

        //validate id existing in database
        try {
            const resultValidationIdDatabase = await FaqsModel.findIdDatabase(id)
            if('message' in resultValidationIdDatabase){
                res.status(400).json({
                    message: resultValidationIdDatabase.message
                })
                return
            }
        } catch (error) {
            next(error)
        }

        const resultValidationInputData = validateFaqUpdate(req.body)

        if(!resultValidationInputData.success){
            res.status(400).json({
                message: 'Update FAQ error.',
                errors: resultValidationInputData.error.format()
            })
            return
        }

        try {
            await FaqsModel.updateFaq(id, resultValidationInputData.data)
            res.status(HttpCode.CREATED).json({
                message: 'Faq updated sucessfully'
            })
        } catch (error) {
            next(error)
        }
    }
}