import Joi from "joi";
import { name } from "./auth.validation.js";
import { validateBody } from "../../utils/validate.util.js";

const term = Joi.object({
    title: name,
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required()
});

export default validateBody(term);