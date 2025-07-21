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
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 1024 * 1024,
      fields: 10,
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
  });

  // Middleware
  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  // Swagger UI
  const swaggerPath = path.resolve(__dirname, '../docs/swagger.json');
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

  const swaggerOptions = {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      defaultModelExpandDepth: 3,
      tryItOutEnabled: true,
    },
  };

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

  // Роутери
  app.use('/auth', authRouter);
  app.use('/contacts', authenticate, contactsRouter);

  // Обробка помилок Multer
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        status: 'error',
        message: 'File upload error: ' + err.message,
        data: null,
      });
    } else if (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
        data: null,
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
