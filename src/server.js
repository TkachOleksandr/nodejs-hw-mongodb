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

  // Multer налаштування
  const upload = multer({
    limits: {
      fileSize: 1000000, // 1MB
      fields: 10
    }
  });

  // Middlewares (важливий порядок!)
  app.use(upload.none()); // Спочатку обробка form-data
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());
  app.use(pino());

  // Swagger документація
  const swaggerPath = path.resolve(__dirname, '../docs/swagger.json');
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

  const swaggerOptions = {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      defaultModelExpandDepth: 2,
      tryItOutEnabled: true // Дозволити "Try it out" для всіх методів
    }
  };

  app.use('/api-docs', 
    swaggerUi.serveFiles(swaggerDocument, swaggerOptions),
    (req, res) => res.send(swaggerUi.generateHTML(swaggerDocument, swaggerOptions))
  );

  // Маршрути
  app.use('/auth', authRouter);
  app.use('/contacts', authenticate, contactsRouter);

  // Обробка помилок Multer
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        status: 'error',
        message: 'File upload error: ' + err.message,
        data: null
      });
    }
    next(err);
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`📚 API docs: http://localhost:${PORT}/api-docs`);
  });
};