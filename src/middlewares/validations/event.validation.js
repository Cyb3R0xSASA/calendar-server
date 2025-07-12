import Joi from "joi";
import { name } from "./auth.validation.js";
import { groups } from "../../models/events.model.js";
import { validateBody } from "../../utils/validate.util.js";

const banner = Joi.object({
    url: Joi.string().uri(),
});

const event = Joi.object({
    title: name,
    description: Joi.string().min(10).max(1500),
    date: Joi.date().iso().required(),
    categories: Joi.array().items(
        Joi.string()
            .regex(/^[0-9a-fA-F]{24}/)
    ),
    targetGroups: Joi.array().items(
        Joi.string().valid(...groups).default(groups[0])
    ),
    banner: banner.required(),
});

export default validateBody(event)