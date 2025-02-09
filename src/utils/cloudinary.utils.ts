import { HttpCode } from "../enums"
import { AppError } from "../exceptions/AppError"
import cloudinary from "../config/cloudinary.config"
import fs from 'fs'


export class Cloudinary {
    static async uploadImage (filePath: string, folder: string = 'uploadsOlympusGYM'): Promise <{url: string, public_id: string} | AppError>{
        try {
            const result = await cloudinary.uploader.upload(filePath, {
                folder,
                use_filename: true,
                unique_filename: false,
                overwrite: true
            })

            fs.unlinkSync(filePath)

            return{
                url: result.secure_url,
                public_id: result.public_id
            }
        } catch (error) {
            throw new AppError({
                name: 'AuthError',
                httpCode: HttpCode.BAD_REQUEST,
                description: `Error uploading file to cloudinary`
            })
        }
    }

    static async deleteImage (publicId: string): Promise<{message: string} | AppError>{
        try {
            await cloudinary.uploader.destroy(publicId)
            return {
                message: 'Image deleted sucessfully'
            }
        } catch (error) {
            throw new AppError({
                name: 'AuthError',
                httpCode: HttpCode.BAD_REQUEST,
                description: `Error delete file to cloudinary`
            })
        }
    }
}