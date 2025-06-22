import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getAllContacts } from './controllers/contactsController.js';
import { getContactById } from './controllers/contactsController.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Роут
  app.get('/contacts/:contactId', getContactById);
  app.get('/contacts', getAllContacts);

  // Обробка неіснуючих маршрутів
 app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};

// 🟢 Додай цей виклик, інакше сервер не запускається
setupServer();