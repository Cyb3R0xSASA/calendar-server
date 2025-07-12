import Joi from "joi";
import { name, password } from "./auth.validation.js";
import { validateBody } from "../../utils/validate.util.js";

const changePassword = Joi.object({
    old_password: password.password,
    ...password,
});

const changeRole = Joi.object({
    role: Joi.string().valid('user', 'admin', 'publisher'),
});

const updateProfile = Joi.object({
    first_name: name,
    last_name: name,
});

export const userValidation = {
    changePassword: validateBody(changePassword),
    changeRole: validateBody(changeRole),
    updateProfile: validateBody(updateProfile),
};