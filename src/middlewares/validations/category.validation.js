import Joi from "joi";
import { name } from "./auth.validation.js";
import { validateBody } from "../../utils/validate.util.js";

const category = Joi.object({ title: name });

export default validateBody(category);

