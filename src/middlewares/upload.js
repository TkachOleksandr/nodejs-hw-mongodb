import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return cb(new Error('Only images are allowed'), false);
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter });