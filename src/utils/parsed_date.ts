import { HttpCode } from "../../../olympus-gym-backend/src/enums"
import { AppError } from "../../../olympus-gym-backend/src/exceptions/AppError"

export class parsed_date {
    static async parsedDate (date: Date): Promise<Date>{
        try {
            const parsed = new Date(date)
            if(isNaN(parsed.getTime())){
                throw new AppError({
                    name: 'Validation error',
                    httpCode: HttpCode.BAD_REQUEST,
                    description: 'Invalid birthDate format'
                })
            }
            return parsed
        } catch (error) {
            throw error
        }
    }
}