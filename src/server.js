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

export const startServer = async () => {
  const app = express();

  // Завантаження Swagger документації
  const swaggerPath = path.resolve(__dirname, '../docs/swagger.json');
  console.log('Swagger file path:', swaggerPath);
  
  if (!fs.existsSync(swaggerPath)) {
    throw new Error('Swagger file not found at: ' + swaggerPath);
  }

  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));

  // Middlewares
  app.use(cookieParser());
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  // Логування запитів
  app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
  });

  // Спеціальні налаштування для Swagger UI
  const swaggerOptions = {
    explorer: true,
    swaggerOptions: {
      validatorUrl: null,
      docExpansion: 'list',
      persistAuthorization: true,
      displayRequestDuration: true,
      // Додаємо параметр для коректного відображення path parameters
      plugins: [
        () => ({
          statePlugins: {
            spec: {
              wrapSelectors: {
                allowTryItOutFor: () => () => true
              }
            }
          }
        })
      ]
    }
  };

  // Додаємо endpoint для raw swagger.json
  app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });

  // Підключення Swagger UI з урахуванням усіх налаштувань
  app.use('/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptions)
  );

  // Маршрути
  app.use('/contacts', authenticate, contactsRouter);
  app.use('/auth', authRouter);

  // Обробка помилок
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`📚 API docs available at http://localhost:${PORT}/api-docs`);
  });
};