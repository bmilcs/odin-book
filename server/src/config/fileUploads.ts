import { Request } from 'express';
import multer, { Options } from 'multer';
import path from 'path';

const store = (destination: string) =>
  multer.diskStorage({
    destination: (req: Request, file, cb) => {
      cb(null, path.join(__dirname, destination));
    },
    filename: (req: Request, file, cb) => {
      const fileExt = file.originalname.split('.').pop();
      const fileName = req.userId! + '.' + fileExt;
      cb(null, fileName);
    },
  });

const profileImageUploadOptions: Options = {
  storage: store('../uploads/profile-images'),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
};

const postImageUploadOptions: Options = {
  storage: store(path.join(__dirname, '../uploads/post-images')),
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
