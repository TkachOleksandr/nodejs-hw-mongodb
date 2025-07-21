import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService,
} from '../services/contacts.js';
import createError from 'http-errors';
import { uploadImageToCloudinary } from '../utils/cloudinary.js';

const validateContactData = (data) => {
  const { name, email, phone } = data;
  if (!name || !email || !phone) {
    throw createError(400, 'Missing required fields');
  }
};

export const getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'createdAt', sortOrder = 'desc', favorite } = req.query;
    
    const filter = {};
    if (favorite !== undefined) {
      filter.favorite = favorite === 'true';
    }

    const contacts = await getAllContactsService({
      userId: req.user._id,
      page: Number(page),
      perPage: Number(perPage),
      sortBy,
      sortOrder,
      filter,
    });

    res.json({
      status: 'success',
      code: 200,
      message: 'Contacts retrieved successfully',
      data: {
        contacts: contacts.data,
        total: contacts.totalItems,
        page: contacts.page,
        perPage: contacts.perPage,
        totalPages: contacts.totalPages,
        hasPreviousPage: contacts.hasPreviousPage,
        hasNextPage: contacts.hasNextPage,
      },
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
    res.json({
      status: 'success',
      code: 200,
      message: 'Contact retrieved successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    validateContactData(req.body);
    
    let photoUrl;
    if (req.file) {
      photoUrl = await uploadImageToCloudinary(req.file.buffer);
    }

    const contact = await createContactService({
      ...req.body,
      owner: req.user._id,
      ...(photoUrl && { photo: photoUrl }),
    });

    res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Contact created successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const updatedData = { ...req.body };
    
    if (req.file) {
      updatedData.photo = await uploadImageToCloudinary(req.file.buffer);
    }

    const updatedContact = await updateContactService(
      req.user._id,
      req.params.contactId,
      updatedData
    );

    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

    res.json({
      status: 'success',
      code: 200,
      message: 'Contact updated successfully',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const deletedContact = await deleteContactService(req.user._id, req.params.contactId);
    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }
    res.json({
      status: 'success',
      code: 200,
      message: 'Contact deleted successfully',
      data: { _id: deletedContact._id },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadContactPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createError(400, 'Photo is required');
    }

    const photoUrl = await uploadImageToCloudinary(req.file.buffer);
    const updatedContact = await updateContactService(req.user._id, req.params.contactId, {
      photo: photoUrl,
    });

    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

    res.json({
      status: 'success',
      code: 200,
      message: 'Photo uploaded successfully',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};