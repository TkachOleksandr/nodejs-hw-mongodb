import dotenv from 'dotenv';
dotenv.config();

import { initMongoDB } from './db/initMongoConnection.js';
import { startServer } from './server.js';

const bootstrap = async () => {
  await initMongoDB();
  startServer();
};

bootstrap();
