import Joi from 'joi';

export const jobPayloadSchema = Joi.object({
    category_id: Joi.string().required(),
    company_id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    job_type: Joi.string().required(),
    experience_level: Joi.string().required(),
    location_type: Joi.string().required(),
    location_city: Joi.string().optional(),
    salary_min: Joi.number().optional(),
    salary_max: Joi.number().optional(),
    is_salary_visible: Joi.boolean().optional(),
    user_id: Joi.string().optional(),
    status: Joi.string().required()
});

export const updateJobPayloadSchema = Joi.object({
    category_id: Joi.string().optional(),
    company_id: Joi.string().optional(),
    user_id: Joi.string().optional(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    job_type: Joi.string().optional(),
    experience_level: Joi.string().optional(),
    location_type: Joi.string().optional(),
    location_city: Joi.string().optional(),
    salary_min: Joi.number().optional(),
    salary_max: Joi.number().optional(),
    is_salary_visible: Joi.boolean().optional(),
    status: Joi.string().optional()
}).min(1);
