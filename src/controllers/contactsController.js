mport {
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
      status: 'success',              // рядок, а не число
      code: 200,
      message: 'Контакти отримано',
      data: {
        contacts: contacts.data,
        total: contacts.totalItems,
        page: contacts.page,
        limit: contacts.perPage,
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
      throw createError(404, 'Контакт не знайдено');
    }

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Контакт отримано',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    let photoUrl;

    if (req.file?.buffer) {
      photoUrl = await uploadImageToCloudinary(req.file.buffer);
    }

    const contact = await createContactService({
      ...req.body,
      userId: req.user._id,
      ...(photoUrl && { photo: photoUrl }),
    });

    res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Контакт створено',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const updatedData = { ...req.body };

    if (req.file?.buffer) {
      updatedData.photo = await uploadImageToCloudinary(req.file.buffer);
    }

    const updated = await updateContactService(req.user._id, req.params.contactId, updatedData);

    if (!updated) {
      throw createError(404, 'Контакт не знайдено');
    }

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Контакт оновлено',
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
      throw createError(404, 'Контакт не знайдено');
    }

    // Якщо хочеш повертати тіло (не 204), то так:
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Контакт видалено',
      data: deleted,
    });

    // Або можна без тіла та статус 204:
    // res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const uploadContactPhoto = async (req, res, next) => {
  try {
    if (!req.file?.buffer) {
      throw createError(400, 'Фото обов’язкове');
    }

    const photoUrl = await uploadImageToCloudinary(req.file.buffer);

    const updated = await updateContactService(req.user._id, req.params.contactId, {
      photo: photoUrl,
    });

    if (!updated) {
      throw createError(404, 'Контакт не знайдено');
    }

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Фото оновлено',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};