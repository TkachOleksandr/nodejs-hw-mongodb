import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import contactRoutes from './routers/contacts.js';
import { initMongoDB } from './db/initMongoConnection.js';
import { startServer } from './server.js'; 

const app = express();


app.use(express.json());

app.use('/contacts', contactRoutes);

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
