import { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import Product from "../models/product";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { payment, email, phone, address, total, items } = req.body;

    // Валидация полей
    if (!["card", "online"].includes(payment)) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (!phone || typeof phone !== "string") {
      return res.status(400).json({ error: "Invalid phone" });
    }

    if (!address || typeof address !== "string") {
      return res.status(400).json({ error: "Invalid address" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items must be a non-empty array" });
    }

    // Получение товаров из базы
    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return res.status(400).json({ error: "Some items do not exist" });
    }

    const invalidProducts = products.filter((p) => p.price == null);
    if (invalidProducts.length > 0) {
      return res.status(400).json({ error: "Some items are not for sale" });
    }

    const calculatedTotal = products.reduce((sum, p) => sum + p.price, 0);
    if (calculatedTotal !== total) {
      return res
        .status(400)
        .json({ error: "Total does not match product prices" });
    }

    // Генерация ID заказа
    const orderId = faker.string.uuid();

    return res.status(201).json({
      id: orderId,
      total: calculatedTotal,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
