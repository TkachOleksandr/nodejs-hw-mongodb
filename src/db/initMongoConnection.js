import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar';

export const initMongoDB = async () => {
  const user = getEnvVar('MONGODB_USER');
  const pwd = getEnvVar('MONGODB_PASSWORD');
  const url = getEnvVar('MONGODB_URL');
  const db = getEnvVar('MONGODB_DB');

  const uri = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;
  console.log('Connecting to MongoDB with URI:', uri);

  await mongoose.connect(uri);
  console.log('Mongo connection successfully established!');
};
