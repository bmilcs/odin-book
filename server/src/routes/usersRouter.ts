import { usersController } from '@/controllers';
import ensureAuthenticated from '@/middleware/ensureAuthenticated';
import { Router } from 'express';

const usersRouter = Router();

usersRouter.get(
  '/search/:searchTerm?',
  ensureAuthenticated,
  usersController.search,
);

usersRouter.get('/:userId', ensureAuthenticated, usersController.getProfile);

usersRouter.patch(
  ':/userId',
  ensureAuthenticated,
  usersController.updateProfile,
);

export default usersRouter;
