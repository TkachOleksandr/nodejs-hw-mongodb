import Joi from 'joi';

const stringField = Joi.string().min(3).max(20);

export const createContactSchema = Joi.object({
  name: stringField.required(),
  phoneNumber: stringField.required(),
  email: stringField.email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: stringField.required()
});

export const updateContactSchema = Joi.object({
  name: stringField.optional(),
  phoneNumber: stringField.optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: stringField.optional()
}).min(1);
