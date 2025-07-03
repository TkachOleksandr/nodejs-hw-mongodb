import { Contact } from '../models/contactModel.js';

export const getAllContactsService = async ({ userId, page, perPage, sortBy, sortOrder, filter }) => {
  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const query = { userId, ...filter };

  const totalItems = await Contact.countDocuments(query);
  const data = await Contact.find(query).sort(sort).skip(skip).limit(perPage);

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

export const getContactByIdService = async (userId, id) =>
  Contact.findOne({ _id: id, userId });

export const createContactService = async (data) => Contact.create(data);

export const updateContactService = async (userId, id, data) =>
  Contact.findOneAndUpdate({ _id: id, userId }, data, { new: true });

export const deleteContactService = async (userId, id) =>
  Contact.findOneAndDelete({ _id: id, userId });