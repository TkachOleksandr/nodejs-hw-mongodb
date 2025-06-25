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

import { getAllContacts, getContactById } from './controllers/contactsController.js';

export const startServer = async () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

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