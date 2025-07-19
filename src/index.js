import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

import contactRoutes from './routers/contacts.js';
import authRoutes from './routers/auth.js';
import { initMongoDB } from './db/initMongoConnection.js';
import { startServer } from './server.js';
import { authenticate } from './middlewares/authenticate.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'docs/swagger.json'), 'utf-8')
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', authRoutes);

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