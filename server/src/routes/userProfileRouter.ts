import { userProfileController } from '@/controllers';
import ensureAuthenticated from '@/middleware/ensureAuthenticated';
import { Router } from 'express';

const userProfileRouter = Router();

userProfileRouter.get(
  '/:id',
  ensureAuthenticated,
  userProfileController.getProfile,
);

userProfileRouter.patch(
  ':/id',
  ensureAuthenticated,
  userProfileController.updateProfile,
);

export default userProfileRouter;
