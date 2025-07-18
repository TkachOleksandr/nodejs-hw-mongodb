import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';

import contactRoutes from './routers/contacts.js';
import authRoutes from './routers/auth.js';
import { initMongoDB } from './db/initMongoConnection.js';
import { startServer } from './server.js';
import { authenticate } from './middlewares/authenticate.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

// Маршрути auth (реєстрація, логін, оновлення сесії, тощо)
app.use('/auth', authRoutes);

// Захищені маршрути контактів — тільки для авторизованих користувачів
app.use('/contacts', authenticate, contactRoutes);

const bootstrap = async () => {
  try {
    await initMongoDB();

    await startServer(app);

    console.log('Server started successfully');
  } catch (error) {
    console.error('Error during server start:', error);
    process.exit(1);
  }
};

bootstrap();