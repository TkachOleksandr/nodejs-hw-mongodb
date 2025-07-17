import dotenv from 'dotenv';
dotenv.config();
console.log("JWT_ACCESS_SECRET:", process.env.JWT_ACCESS_SECRET);

import { initMongoDB } from './db/initMongoConnection.js';
import { startServer } from './server.js';

const bootstrap = async () => {
  await initMongoDB();
  await startServer();
};

bootstrap();