import * as yup from 'yup';

export const registerSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export const resetPasswordSchema = yup.object({
  token: yup.string().required(),
  password: yup.string().required(),
});

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export const emailOnlySchema = yup.object({
  email: yup.string().email().required(),
});
