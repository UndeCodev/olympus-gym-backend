import { NextFunction, Request, Response } from "express";
import { faqCreationSchema, faqUpdateSchema, validateFAQInRange } from "../schemas/Faqs";
import { HttpCode } from "../enums";
import { FaqsModel } from "../models/faqs";


export class FaqsController {

    static async getAllFaqs(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await FaqsModel.getAllFaqs()
            res.status(HttpCode.OK).json({
                faqs: result
            })
        } catch (error) {
            next(error)
        }
    }

    static async getFaqsInRange(req: Request, res: Response, next: NextFunction){
        try {
            const {start, end} = req.body
            const resultValidationInputData = validateFAQInRange(req.body)
            
            if(!resultValidationInputData.succes){
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'Value end must be greater than or equal to start',
                    errors: resultValidationInputData.error?._errors
                })
                return
            }
        
            const maxRange = end - start
            if(maxRange>5){
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'The range for listing FAQs should be a minimum of 1 and a maximum of 5.'
                })
                return
            }

            const resultGetFaqsInRange = await FaqsModel.getFaqsInRange(start, end)
            res.status(HttpCode.OK).json({
                faqs: resultGetFaqsInRange
            })
        } catch (error) {
            next(error)
        }
    }


    static async createFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const resultValidationInputData = faqCreationSchema.safeParse(req.body)

            if(!resultValidationInputData.success) {
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'Validation FAQ error.',
                    errors: resultValidationInputData.error.format()
                })
                return
            }

            await FaqsModel.createFaq(resultValidationInputData.data)
            res.status(HttpCode.CREATED).json({
                message: 'Faq created sucessfully'
            })
            return
        } catch (error) {
            next(error)
        }
    }

    static async updateFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            //validate input data
            const resultValidationInputData = faqUpdateSchema.safeParse(req.body)

            if(!resultValidationInputData.success){
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'Error Validation Input Data',
                    errors: resultValidationInputData.error.format()
                })
                return
            }

            //get and validate id input
            const id = parseInt(req.params.id)
            if (isNaN(id)) {
                res.status(HttpCode.BAD_REQUEST).json({
                    message: 'Invalid ID'
                })
                return
            }

            //validate id existing in database
            const idFaqExistsInDatabase = await FaqsModel.findFaqById(id)
            if (!idFaqExistsInDatabase) {
                res.status(HttpCode.BAD_REQUEST).json({
                    message: `Faq by id: ${id} not found in database`
                })
                return
            }

            await FaqsModel.updateFaq(id, resultValidationInputData.data)
            res.status(HttpCode.OK).json({
                message: 'Faq correctly updated'
            })
            return
        } catch (error) {
            next(error)
        }
    }
}