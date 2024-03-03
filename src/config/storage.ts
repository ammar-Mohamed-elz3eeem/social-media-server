import multer from "multer";
import uploadConfig from '@/config/uploader';

export const avatarStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // console.log(file);
    callback(null, uploadConfig.avatars_path)
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  }
});

export const uploadsStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadConfig.uploads_path);
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  }
});
