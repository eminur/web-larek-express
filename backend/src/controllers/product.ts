import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import { BadRequestError } from "../errors/bad-request-error";
import { ConflictError } from "../errors/conflict-error";
import { NotFoundError } from "../errors/not-found-error";
import Product from "../models/product";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find({});
    return res.status(200).send({ items: products, total: products.length });
  } catch (error) {
    if (error instanceof MongooseError.DocumentNotFoundError) {
      return next(new NotFoundError(error.message));
    }

    return next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /*
    const defaultProduct = {
        'description': 'Будет стоять над душой и не давать прокрастинировать.',
        'image': {
            fileName: '/images/Asterisk_2.png',
            originalName: 'Asterisk_2.png'
        },
        'title': 'Мамка-таймер',
        'category': 'софт-скил',
        'price': null
    };
    */

  try {
    const { description, image, title, category, price } = req.body;

    const product = await Product.create({
      description: description,
      image: image,
      title: title,
      category: category,
      price: price,
    });

    return res.status(201).send({ item: product });
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError("Ошибка валидации данных при создании товара")
      );
    }

    if (error instanceof Error && error.message.includes("E11000")) {
      return next(new ConflictError("Товар с таким title уже существует"));
    }

    return next(error);
  }
};
