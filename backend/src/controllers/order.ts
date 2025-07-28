import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import { BadRequestError } from '../errors/bad-request-error';

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { payment, email, phone, address, total, items } = req.body;

    // Валидация полей
    if (!['card', 'online'].includes(payment)) {
      return next(new BadRequestError('Не указан или неверный метод оплаты!'));
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return next(new BadRequestError('Не указан или неверный email!'));
    }

    if (!phone || typeof phone !== 'string') {
      return next(new BadRequestError('Не указан телефон!'));
    }

    if (!address || typeof address !== 'string') {
      return next(new BadRequestError('Не указан адрес!'));
    }

    if (!Array.isArray(items) || items.length === 0) {
      return next(new BadRequestError('Не выбран товар!'));
    }

    // Получение товаров из базы
    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return next(new BadRequestError('Товар не существует!'));
    }

    const invalidProducts = products.filter((p) => p.price == null);
    if (invalidProducts.length > 0) {
      return next(new BadRequestError('Выбран товар без стоимости!'));
    }

    const calculatedTotal = products.reduce((sum, p) => sum + p.price, 0);
    if (calculatedTotal !== total) {
      return next(
        new BadRequestError('Стоимость товаров не равна общей сумме!')
      );
    }

    const orderId = faker.string.uuid();

    return res.status(201).send({
      id: orderId,
      total: calculatedTotal,
    });
  } catch (error) {
    return next(error);
  }
};
