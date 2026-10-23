import Joi from 'joi';

export const companyPayloadSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().required(),
    location: Joi.string().required()
});

export const updateCompanyPayloadSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    location: Joi.string().optional()
}).min(1);