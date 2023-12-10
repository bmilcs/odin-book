import { usersController } from '@/controllers';
import ensureAuthenticated from '@/middleware/ensureAuthenticated';
import { Router } from 'express';

const usersRouter = Router();

usersRouter.get('/:userId', ensureAuthenticated, usersController.getProfile);

usersRouter.patch(
  ':/userId',
  ensureAuthenticated,
  usersController.updateProfile,
);

usersRouter.get(
  '/search/:username',
  ensureAuthenticated,
  usersController.search,
);

export default usersRouter;
