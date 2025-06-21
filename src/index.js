console.log('CWD:', process.cwd());
console.log('Current file:', import.meta.url);
import dotenv from 'dotenv';
dotenv.config();

import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const startApp = async () => {
  await initMongoConnection();
  setupServer();
};

startApp();