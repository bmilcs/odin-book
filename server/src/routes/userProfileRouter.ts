import { userProfileController } from '@/controllers';
import { Router } from 'express';

const userProfileRouter = Router();

userProfileRouter.get('/:id', userProfileController.getProfile);

userProfileRouter.patch(':/id', userProfileController.updateProfile);

export default userProfileRouter;
