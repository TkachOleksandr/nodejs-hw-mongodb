import createError from 'http-errors';
import {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  updateContactService,
  deleteContactService,
} from '../services/contacts.js';

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await getAllContactsService();
    res.status(200).json({ status: 200, message: 'Successfully retrieved all contacts!', data: contacts });
  } catch (err) {
    next(err);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactByIdService(contactId);
    if (!contact) throw createError(404, 'Contact not found');
    res.status(200).json({ status: 200, message: 'Successfully found contact!', data: contact });
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = await createContactService(req.body);
    res.status(201).json({ status: 201, message: 'Successfully created a contact!', data: contact });
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updated = await updateContactService(contactId, req.body);
    if (!updated) throw createError(404, 'Contact not found');
    res.status(200).json({ status: 200, message: 'Successfully patched a contact!', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleted = await deleteContactService(contactId);
    if (!deleted) throw createError(404, 'Contact not found');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};