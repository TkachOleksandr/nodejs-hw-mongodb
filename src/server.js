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
import multer from 'multer';
import { authenticate } from './middlewares/authenticate.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const startServer = async () => {
  const app = express();

  // Завантаження Swagger документації
  const swaggerPath = path.resolve(__dirname, '../docs/swagger.json');
  if (!fs.existsSync(swaggerPath)) {
    throw new Error('Swagger file not found');
  }
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

  // Middlewares
  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());
  app.use(multer().none()); // Для обробки multipart/form-data

  // Swagger UI
  const swaggerOptions = {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      defaultModelExpandDepth: 2
    }
  };

  app.use('/api-docs', 
    swaggerUi.serveFiles(swaggerDocument, swaggerOptions),
    (req, res) => {
      res.send(swaggerUi.generateHTML(swaggerDocument, swaggerOptions));
    }
  );

  // Маршрути
  app.use('/auth', authRouter);
  app.use('/contacts', authenticate, contactsRouter);

  // Обробка помилок
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API docs: http://localhost:${PORT}/api-docs`);
  });
};