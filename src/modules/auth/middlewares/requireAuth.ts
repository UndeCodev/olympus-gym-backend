import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../core/errors/AppError";
import { HttpCode } from "../../../shared/interfaces/HttpCode";

export const requireAuth = (_: Request, res: Response, next: NextFunction) => {
    if(!res.locals.user){
        throw new AppError({
            httpCode: HttpCode.UNAUTHORIZED,
            description: 'Authenticated required'
        })
    }

    next()
};