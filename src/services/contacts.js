import { Contact } from '../models/contact.js';

export const getAllContactsService = async () => {
  return await Contact.find();
};