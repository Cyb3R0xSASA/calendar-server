import Joi from "joi";
import { password } from "./auth.validation.js";
import { validateBody } from "../../utils/validate.util.js";

const changePassword = Joi.object({
    old_password: password.password,
    ...password,
});

const changeRole = Joi.object({
    role: Joi.string().valid('user', 'admin'),
});

export const userValidation = {
    changePassword: validateBody(changePassword),
    changeRole: validateBody(changeRole),
};