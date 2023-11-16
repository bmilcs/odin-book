import { userProfileController } from '@/controllers';
import ensureAuthenticated from '@/middleware/ensureAuthenticated';
import { Router } from 'express';

const userProfileRouter = Router();

userProfileRouter.get(
  '/:userId',
  ensureAuthenticated,
  userProfileController.getProfile,
);

userProfileRouter.patch(
  ':/userId',
  ensureAuthenticated,
  userProfileController.updateProfile,
);

export default userProfileRouter;
