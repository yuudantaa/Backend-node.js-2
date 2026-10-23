import Joi from 'joi';

export const createApplicationPayloadSchema = Joi.object({
    job_id: Joi.string().required(),
    user_id: Joi.string().optional(),
    status: Joi.string().required(),
});

export const updateApplicationStatusSchema = Joi.object({
    status: Joi.string().required(),
});