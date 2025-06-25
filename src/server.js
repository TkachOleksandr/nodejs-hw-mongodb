import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
  console.error('Failed to load .env file:', result.error);
  process.exit(1);
}

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
import { initMongoDB } from './db/initMongoConnection.js';

export const setupServer = async () => {
  await initMongoDB(); 

  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

 
  app.get('/contacts/:contactId', getContactById);
  app.get('/contacts', getAllContacts);

  
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};

setupServer(); 
