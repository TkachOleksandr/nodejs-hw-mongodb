import { v2 as cloudinary } from 'cloudinary';
import { promises as fs } from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Функція для завантаження зображення в Cloudinary і видалення тимчасового файлу
export const uploadImageToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'contacts', // необов’язково, але організовує файли у папці
    transformation: [{ width: 500, crop: 'limit' }], // опціонально
  });

  await fs.unlink(filePath); // очищення тимчасового файлу після завантаження
  return result.secure_url; // URL до зображення
};