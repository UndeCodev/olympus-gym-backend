import { NextFunction, Request, Response } from "express";
import { validateFaqCreation, validateFaqUpdate } from "../schemas/Faqs";
import { HttpCode } from "../enums";
import { FaqsModel } from "../models/faqs";


export class FaqsController {

    static async getFaqs(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await FaqsModel.getAllFaqs()
            res.json({
                faqs: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async getFaqsRange(req: Request, res: Response, next: NextFunction){
        const data = req.body
        const range = {
            start: parseInt(data.start),
            end: parseInt(data.end)
        }
        const maxRange = range.end - range.start
        
        if(maxRange<=5){
            try {
                const result = await FaqsModel.getFaqsInRange(range.start, range.end)
                res.json({
                    faqs: result
                })
            } catch (error) {
                next(error)
            }
        }else {
            res.status(HttpCode.BAD_REQUEST).json({
                meesage: 'the range for listing FAQs should be a minimum of 1 and a maximum of 5.',
            })
        }
        
    }


    static async createFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
        const resultValidationInputData = validateFaqCreation(req.body)

        if (!resultValidationInputData.success) {
            res.status(HttpCode.BAD_REQUEST).json({
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

    static async updateFaq(req: Request, res: Response, next: NextFunction): Promise<void> {

        //get id
        const id = parseInt(req.params.id)
        if (isNaN(id)) {
            res.status(HttpCode.BAD_REQUEST).json({
                message: 'Invalid ID'
            })
            return
        }

        //validate id existing in database
        try {
            const resultValidationIdDatabase = await FaqsModel.findIdDatabase(id)
            if ('message' in resultValidationIdDatabase) {
                res.status(HttpCode.BAD_REQUEST).json({
                    message: resultValidationIdDatabase.message
                })
                return
            }
        } catch (error) {
            next(error)
        }

        const resultValidationInputData = validateFaqUpdate(req.body)

        if (!resultValidationInputData.success) {
            res.status(HttpCode.BAD_REQUEST).json({
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