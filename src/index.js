import { initMongoDB } from './db/initMongoConnection.js';
import { startServer } from './server.js';

const bootstrap = async () => {
  try {
    await initMongoDB();
    await startServer();
    console.log('✅ Server started successfully');
  } catch (error) {
    console.error('❌ Error during server start:', error);
    process.exit(1);
  }
};

bootstrap();