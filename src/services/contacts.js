import { Contact } from '../models/contactModel.js';

export const getAllContactsService = async () => Contact.find();

export const getContactByIdService = async (id) => Contact.findById(id);

export const createContactService = async (data) => Contact.create(data);

export const updateContactService = async (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

export const deleteContactService = async (id) => Contact.findByIdAndDelete(id);