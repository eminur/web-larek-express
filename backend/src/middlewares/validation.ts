// middlewares/validators.ts
import { celebrate, Joi, Segments } from 'celebrate';

export const validateCreateProduct = celebrate({
  [Segments.BODY]: Joi.object().keys({
    description: Joi.string(),
    image: Joi.object().keys({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }),
    title: Joi.string().min(2).max(30).required(),
    category: Joi.string().required(),
    price: Joi.number().default(null),
  }),
});
