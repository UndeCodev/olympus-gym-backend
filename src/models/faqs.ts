import { PrismaClient } from "@prisma/client";
import { Faqs } from "../types";
import { AppError } from "../exceptions/AppError";
import { HttpCode } from "../enums";


const prisma = new PrismaClient()

export class FaqsModel {
    static async getAllFaqs (): Promise<Faqs[] | AppError>{
        const faqs = await prisma.faqs.findMany()
        if(faqs.length === 0 || !faqs){
            throw new AppError({
                name: 'GetAllFaqsError',
                httpCode: HttpCode.BAD_REQUEST,
                description: `No FAQs in database`
            })
        }
        return faqs
    }

    static async getFaqsInRange(start: number, end: number): Promise <Faqs[] | AppError>{
        const skip = start-1
        const take = end - start + 1

        const faqs = await prisma.faqs.findMany({
            skip: skip,
            take: take
        })
        
        if(faqs.length === 0 || !faqs){
            throw new AppError({
                name: 'GetFaqsInRangeError',
                httpCode: HttpCode.BAD_REQUEST,
                description: `No FAQs found in range: ${start} - ${end}`
            })
        }
        return faqs
    }

    static async createFaq (input: Faqs):Promise <Faqs> {
        const {question, answer} = input

        const faqCreated = await prisma.faqs.create({
            data:{
                question,
                answer
            }
        })
        return faqCreated
    }

    static async updateFaq (id: number, data:{ question?: string; answer?: string }): Promise<Faqs | AppError> {
        const faqUpdate = await prisma.faqs.update({
            where: {id},
            data
        })
        
        if(!faqUpdate){
            throw new AppError({
                name: 'ErrorFaqUpdate',
                httpCode: HttpCode.BAD_REQUEST,
                description: `Error during faq by id: ${id} updated`
            })
        }
        return faqUpdate
    }

    static async findFaqById (id: number): Promise <Faqs | null>{
        const resultFindByIdInDatabase = await prisma.faqs.findUnique({
            where: {id}
        })        
        return resultFindByIdInDatabase
    }
}