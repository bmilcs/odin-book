import { profileImageUpload } from '@/config/fileUploads';
import { usersController } from '@/controllers';
import { ensureAuthenticated, handleValidationErrors } from '@/middleware';
import { validateUpdateProfile } from '@/validation';
import { Router } from 'express';

const usersRouter = Router();

usersRouter.get(
  '/search/:searchTerm?',
  ensureAuthenticated,
  usersController.search,
);

usersRouter.get('/:username', ensureAuthenticated, usersController.getProfile);

usersRouter.patch(
  '/:username',
  ensureAuthenticated,
  validateUpdateProfile,
  handleValidationErrors,
  usersController.updateProfile,
);

usersRouter.put(
  '/:username/upload-profile-image',
  ensureAuthenticated,
  profileImageUpload.single('file'),
  usersController.uploadProfileImage,
);

export default usersRouter;
