import Joi from "joi";
import { validateBody } from "../../utils/validate.util.js";

export const name = Joi.string().min(2).max(30).required().pattern(/^[A-Za-z]{2,10}$/)
const email = { email: Joi.string().email().lowercase().trim().required() };
export const password = { password: Joi.string().min(8).max(100).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:',.<>?/])[A-Za-z\d!@#$%^&*()_+\-=\[\]{}|;:',.<>?/]{8,100}$/) }
const otp = { otp: Joi.string().required().pattern(/^\d{6}$/) }


const register = Joi.object({
    firstName: name,
    lastName: name,
    ...email,
    ...password,
});

const verifyEmail = Joi.object({
    ...otp,
    ...email
});

const sendOtp = Joi.object({ ...email });

const login = Joi.object({
    ...email,
    ...password,
});

const resetPassword = Joi.object({
    ...otp,
    ...email,
    ...password
});

export const authValidation = {
    register: validateBody(register),
    verifyEmail: validateBody(verifyEmail),
    sendOtp: validateBody(sendOtp),
    login: validateBody(login),
    resetPassword: validateBody(resetPassword),
}