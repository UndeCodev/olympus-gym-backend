import { HttpCode } from "../enums"
import { AppError } from "../exceptions/AppError"
import cloudinary from "../config/cloudinary.config"
// @ts-ignore
import streamifier from 'streamifier';

export class Cloudinary {
    static async uploadImage (buffer: Buffer){
        try {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'imageProducts' }, // Opcional: cambia el folder en Cloudinary
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result)
                    }
                );
                streamifier.createReadStream(buffer).pipe(stream)
            })
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