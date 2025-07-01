import { Contact } from '../models/contactModel.js';

export const getAllContactsService = async ({ page, perPage, sortBy, sortOrder, filter }) => {
  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const totalItems = await Contact.countDocuments(filter);
  const data = await Contact.find(filter).sort(sort).skip(skip).limit(perPage);

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages: Math.ceil(totalItems / perPage),
    hasPreviousPage: page > 1,
    hasNextPage: page * perPage < totalItems
  };
};

export const getContactByIdService = async (id) => Contact.findById(id);

export const createContactService = async (data) => Contact.create(data);

export const updateContactService = async (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

export const deleteContactService = async (id) => Contact.findByIdAndDelete(id);