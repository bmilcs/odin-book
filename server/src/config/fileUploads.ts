import { Request } from 'express';
import multer from 'multer';
import path from 'path';

const profileImageStorage = multer.diskStorage({
  destination: (req: Request, image, cb) => {
    cb(null, path.join(__dirname, '../uploads/profile-images'));
  },
  filename: (req: Request, image, cb) => {
    const fileExt = image.originalname.split('.').pop();
    const fileName = req.userId! + '.' + fileExt;
    cb(null, fileName);
  },
});

export const profileImageUpload = multer({ storage: profileImageStorage });

const postImageStorage = multer.diskStorage({
  destination: (req: Request, image, cb) => {
    cb(null, path.join(__dirname, '../uploads/post-images'));
  },
  filename: (req: Request, image, cb) => {
    const fileExt = image.originalname.split('.').pop();
    const fileName = req.userId! + '.' + fileExt;
    cb(null, fileName);
  },
});

export const postImageUpload = multer({ storage: postImageStorage });
