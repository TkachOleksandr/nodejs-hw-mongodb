import dotenv from 'dotenv';
dotenv.config();

console.log('Loaded env vars:', {
  user: process.env.MONGODB_USER,
  password: process.env.MONGODB_PASSWORD,
  url: process.env.MONGODB_URL,
  db: process.env.MONGODB_DB,
});

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import mongoose from 'mongoose';

import { Contact } from './models/contactModel.js'; 
import { getAllContacts, getContactById } from './controllers/contactsController.js';

export const startServer = async () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());


  app.get('/test-db', async (req, res) => {
    try {
      const contacts = await Contact.find({});
      console.log('Contacts from DB:', contacts); 
      res.status(200).json({ contacts });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ message: 'Error fetching contacts' });
    }
  });

  app.get('/contacts/:contactId', getContactById);
  app.get('/contacts', getAllContacts);

  app.get('/', (req, res) => {
    res.send('Server is working');
  });

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};
