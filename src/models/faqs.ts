import { PrismaClient } from "@prisma/client";
import { Faqs } from "../types";
import { AppError } from "../exceptions/AppError";
import { HttpCode } from "../enums";


const prisma = new PrismaClient()

export class FaqsModel {
    static async createFaq (input: Faqs) {
        const {question} = input

        try {
            const faqCreated = await prisma.faqs.create({
                data:{
                    question
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