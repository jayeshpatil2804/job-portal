import Joi from 'joi';

export const candidateSignupSchema = Joi.object({
    fullName: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    mobile: Joi.string().required().pattern(/^[0-9]{10,15}$/),
    password: Joi.string().required().min(6)
});

export const candidateLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const recruiterSignupSchema = Joi.object({
    fullName: Joi.string().required().min(2).max(50),
    companyName: Joi.string().required().min(2).max(100),
    workEmail: Joi.string().email().required(),
    mobile: Joi.string().required().pattern(/^[0-9]{10,15}$/),
    password: Joi.string().required().min(6)
});

export const recruiterLoginSchema = Joi.object({
    workEmail: Joi.string().email().required(),
    password: Joi.string().required()
});

export const adminLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email(),
    workEmail: Joi.string().email(),
    adminEmail: Joi.string().email()
}).xor('email', 'workEmail', 'adminEmail');

export const verifyOtpSchema = Joi.object({
    email: Joi.string().email(),
    workEmail: Joi.string().email(),
    adminEmail: Joi.string().email(),
    otp: Joi.string().length(6).required()
}).xor('email', 'workEmail', 'adminEmail');

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email(),
    workEmail: Joi.string().email(),
    adminEmail: Joi.string().email(),
    otp: Joi.string().length(6).required(),
    newPassword: Joi.string().required().min(6)
}).xor('email', 'workEmail', 'adminEmail');

export const resendOtpSchema = Joi.object({
    email: Joi.string().email(),
    workEmail: Joi.string().email(),
    adminEmail: Joi.string().email()
}).xor('email', 'workEmail', 'adminEmail');

