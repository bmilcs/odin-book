import { authController } from '@/controllers';
import { Router } from 'express';

const authRouter = Router();

authRouter.post('/signup', authController.signup);

authRouter.post('/login', authController.login);

authRouter.post('/logout', authController.logout);

export default authRouter;
