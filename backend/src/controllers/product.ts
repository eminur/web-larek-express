import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { ConflictError } from '../errors/conflict-error';
import { NotFoundError } from '../errors/not-found-error';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find({});
        res.status(201).send({ items: products, total: products.length });
    }
    catch (error) {
        if (error instanceof MongooseError.DocumentNotFoundError) {
            return next(new NotFoundError(error.message));
        }

        next(error);
    }

}

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {

    const defaultProduct = {
        "description": "Будет стоять над душой и не давать прокрастинировать.",
        "image": {
            fileName: "/images/Asterisk_2.png",
            originalName: "Asterisk_2.png"
        },
        "title": "Мамка-таймер",
        "category": "софт-скил",
        "price": null
    };

    try {
        const product = await Product.create(defaultProduct);
        return res.status(201).send({ item: product });
    } catch (error) {
        // Ошибка валидации данных схемы Mongoose
        if (error instanceof MongooseError.ValidationError) {
            return next(new BadRequestError('Ошибка валидации данных при создании товара'));
        }

        // Ошибка уникальности title
        if (error instanceof Error && error.message.includes('E11000')) {
            return next(new ConflictError('Товар с таким title уже существует'));
        }

        // Неизвестная ошибка
        next(error);

    }
};
