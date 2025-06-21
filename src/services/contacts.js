import Contact from '../models/contactModel.js'; // або шлях до моделі

export const getAllContactsService = async () => {
  return await Contact.find();
};

export const getContactByIdService = async (id) => {
  return await Contact.findById(id);
};
