import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticate } from './middlewares/authenticate.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.resolve(__dirname, '../docs/swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

export const startServer = async () => {
  const app = express();

  app.use(cookieParser());
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Логування запитів
  app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
  });

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/contacts', authenticate, contactsRouter);
  
  // Тестовий роут
  app.get('/test-docs', (req, res) => {
    res.json({ message: 'Test route works!' });
  });

  // Роути авторизації
  app.use('/auth', authRouter);

  // Роути контактів (додай middleware authenticate, якщо потрібен)
  app.use('/contacts', contactsRouter);

  // Обробники 404 і помилок
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
  });
};