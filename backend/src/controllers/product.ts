import { Request, Response } from 'express';
import Product from '../models/product';

export const getProducts = (req: Request, res: Response) => {

    return Product.find({})
        .then((products) => res.send({ items: products, total: products.length }))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const createProduct = (req: Request, res: Response) => {

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

    return Product.create(defaultProduct)
        .then(product => res.send({ item: product }))
        .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};