import { usersController } from '@/controllers';
import { ensureAuthenticated } from '@/middleware';
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
  usersController.updateProfile,
);

export default usersRouter;
