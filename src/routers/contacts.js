  import express from 'express';
  import {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,  
    deleteContact,
    uploadContactPhoto,
  } from '../controllers/contactsController.js';

  import { upload } from '../middlewares/upload.js';
  import ctrlWrapper from '../utils/ctrlWrapper.js';
  import { validateBody } from '../middlewares/validateBody.js';
  import { isValidId } from '../middlewares/isValidId.js';
  import { createContactSchema, updateContactSchema } from '../schemas/contactValidationSchemas.js';
  import { authenticate } from '../middlewares/authenticate.js';

  const router = express.Router();

  router.use(authenticate);

  router.get('/', ctrlWrapper(getAllContacts));
  router.get('/:contactId', isValidId, ctrlWrapper(getContactById));
  router.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContact));
  router.patch('/:contactId', isValidId, upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(updateContact));
  router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));
  router.patch('/:contactId/photo', isValidId, upload.single('photo'), ctrlWrapper(uploadContactPhoto));

  export default router;