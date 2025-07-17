import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService,
} from '../services/contacts.js';

import createError from 'http-errors';
import { uploadImageToCloudinary } from '../utils/cloudinary.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ...filter
    } = req.query;

    const contacts = await getAllContactsService({
      userId: req.user._id,
      page: Number(page),
      perPage: Number(perPage),
      sortBy,
      sortOrder,
      filter,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully retrieved contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const contact = await getContactByIdService(req.user._id, req.params.contactId);

    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully retrieved contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = await createContactService({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const updated = await updateContactService(req.user._id, req.params.contactId, req.body);

    if (!updated) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated a contact!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const deleted = await deleteContactService(req.user._id, req.params.contactId);

    if (!deleted) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully deleted a contact!',
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadContactPhoto = async (req, res, next) => {
  try {
    const { file, user, params } = req;

    if (!file) {
      throw createError(400, 'Photo is required');
    }

    const result = await uploadImageToCloudinary(file.path);

    const updated = await updateContactService(user._id, params.contactId, {
      photo: result.secure_url,
    });

    if (!updated) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Photo updated successfully!',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
