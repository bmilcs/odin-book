import { STORAGE_VOLUME_PATH } from '@/config/env';
import { Request } from 'express';
import multer, { Options } from 'multer';

const store = (destination: string) =>
  multer.diskStorage({
    destination: (req: Request, file, cb) => {
      cb(null, destination);
    },
    filename: (req: Request, file, cb) => {
      const fileExt = file.originalname.split('.').pop();
      const fileName = req.userId! + '.' + fileExt;
      cb(null, fileName);
    },
  });

const profileImageUploadOptions: Options = {
  storage: store(`${STORAGE_VOLUME_PATH}/profile-images`),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
};

const postImageUploadOptions: Options = {
  storage: store(`${STORAGE_VOLUME_PATH}/post-images`),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
};

export const profileImageUpload = multer(profileImageUploadOptions);
export const postImageUpload = multer(postImageUploadOptions);
