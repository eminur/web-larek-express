// middlewares/validators.ts
import { celebrate, Joi, Segments } from 'celebrate';

export const validateCreateProduct = celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().min(2).max(30).required(),
        category: Joi.string().required(),
    }),
});