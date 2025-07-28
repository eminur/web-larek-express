// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { statusCode = 500, message } = err;
    return res.status(statusCode).send({ message: message || 'Ошибка сервера' });
};