import { PrismaClient } from "@prisma/client";
import { Faqs } from "../types";
import { AppError } from "../exceptions/AppError";
import { HttpCode } from "../enums";


const prisma = new PrismaClient()

export class FaqsModel {

    static async getAllFaqs (){
        try {
            const faqs = await prisma.faqs.findMany()
            if(!faqs || faqs.length === 0){
                const res = {
                    message: 'No FAQs found'
                }
                return res
            }
            return faqs
        } catch (error) {
            throw new AppError({
                name: 'AuthError',
                httpCode: HttpCode.BAD_REQUEST,
                description: `Error during get All Faqs`
            })
        }
    }

    static async createFaq (input: Faqs) {
        const {question, answer} = input

        try {
            const faqCreated = await prisma.faqs.create({
                data:{
                    question,
                    answer
                }
            })
            return faqCreated
        } catch (error) {
            throw new AppError({
                name: 'AuthError',
                httpCode: HttpCode.BAD_REQUEST,
                description: `Error during faq creation`
            })
        }
    }

    static async updateFaq (id: number, data: Partial<{ question?: string; answer?: string }>) {
        try {
            const faqUpdate = await prisma.faqs.update({
                where: {id},
                data
            })
            return faqUpdate
        } catch (error) {
            throw new AppError({
                name: 'AuthError',
                httpCode: HttpCode.BAD_REQUEST,
                description: `Error during faq creation`
            })
        }
    }

    static async findIdDatabase (id: number){
        try {
            const resultFindIdDatabase = await prisma.faqs.findUnique({
                where: {id}
            })
            
            if (!resultFindIdDatabase) {
                return {message: `FAQ with ID ${id} does not exist`}
            }
            return resultFindIdDatabase
        } catch (error) {
            throw error
        }
    }
}